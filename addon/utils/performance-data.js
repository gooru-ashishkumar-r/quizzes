/* eslint require-jsdoc: 0 */
import Ember from 'ember';

import { roundFloat } from 'quizzes-addon/utils/math';
import { formatTime } from 'quizzes-addon/utils/utils';

function createPerformanceObject(performance) {
  const score = performance.get('score');
  const timeSpent = performance.get('timeSpent');
  return Ember.Object.create({
    score: score,
    timeSpent: formatTime(timeSpent),
    hasStarted: score > 0 || timeSpent > 0,
    completionDone: performance.get('completionDone'),
    completionTotal: performance.get('completionTotal')
  });
}

function createUserAverageObject(studentPerformance) {
  const score = studentPerformance.get('averageScore');
  const timeSpent = studentPerformance.get('averageTimeSpent');
  return Ember.Object.create({
    score: roundFloat(score),
    studyTime: timeSpent,
    timeSpent: formatTime(roundFloat(timeSpent)),
    hasStarted: score > 0 || timeSpent > 0,
    completionDone: studentPerformance.get('sumCompletionDone'),
    completionTotal: studentPerformance.get('sumCompletionTotal')
  });
}

function createItemAverageObject(classPerformanceData, itemId) {
  const score = classPerformanceData.calculateAverageScoreByItem(itemId);
  const timeSpent = classPerformanceData.calculateAverageTimeSpentByItem(
    itemId
  );

  return Ember.Object.create({
    score: roundFloat(score),
    timeSpent: formatTime(roundFloat(timeSpent)),
    hasStarted: score > 0 || timeSpent > 0,
    completionDone: classPerformanceData.calculateSumCompletionDoneByItem(
      itemId
    ),
    completionTotal: classPerformanceData.calculateSumCompletionTotalByItem(
      itemId
    )
  });
}

function createClassAverageObject(classPerformanceData) {
  const score = classPerformanceData.get('classAverageScore');
  const timeSpent = classPerformanceData.get('classAverageTimeSpent');

  return Ember.Object.create({
    score: roundFloat(score),
    timeSpent: formatTime(roundFloat(timeSpent)),
    hasStarted: score > 0 || timeSpent > 0,
    completionDone: classPerformanceData.get('classSumCompletionDone'),
    completionTotal: classPerformanceData.get('classSumCompletionTotal')
  });
}

/**
 * Create a matrix with random data to be used to fill the teacher analytics data by student.
 * @param headers the table header
 * @param classPerformanceData the base performance data
 */
export function createDataMatrix(headers, classPerformanceData) {
  const studentPerformanceData = classPerformanceData.get(
    'studentPerformanceData'
  );
  const dataMatrix = Ember.A([]);

  studentPerformanceData.forEach(function(studentPerformance) {
    const user = studentPerformance.get('user');
    const performanceData = studentPerformance.get('performanceData');
    var userData = Ember.Object.create({
      user: user.get('fullName'),
      performanceData: Ember.A([])
    });
    headers.forEach(function(headerItem) {
      const performance = performanceData.findBy(
        'id',
        `${user.get('id')}@${headerItem.get('id')}`
      );
      if (performance) {
        userData
          .get('performanceData')
          .push(createPerformanceObject(performance));
      } else {
        userData.get('performanceData').push(undefined);
      }
    });
    // Inserts User averages at position 0 of the current row of performance elements.
    userData
      .get('performanceData')
      .insertAt(0, createUserAverageObject(studentPerformance));
    // Pushes User data in the matrix.
    dataMatrix.push(userData);
  });

  // Inserts the Header average for each item (unit|lesson|collection)
  var itemPerformanceAverageData = Ember.Object.create({
    performanceData: Ember.A([])
  });
  headers.forEach(function(headerItem) {
    const itemPerformanceAverage = createItemAverageObject(
      classPerformanceData,
      headerItem.get('id')
    );
    itemPerformanceAverageData
      .get('performanceData')
      .push(itemPerformanceAverage);
  });
  itemPerformanceAverageData
    .get('performanceData')
    .insertAt(0, createClassAverageObject(classPerformanceData));
  dataMatrix.insertAt(0, itemPerformanceAverageData);
  return dataMatrix;
}
