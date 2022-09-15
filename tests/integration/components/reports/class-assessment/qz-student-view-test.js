import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Collection from 'quizzes-addon/models/collection/collection';
import Resource from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';
import ReportData from 'quizzes-addon/models/result/report-data';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'reports/class-assessment/qz-student-view',
  'Integration | Component | reports/class assessment/qz student view',
  {
    integration: true
  }
);

test('Layout', function(assert) {
  const collection = Collection.create({
    resources: [
      Resource.create({
        id: '56a120483b6e7b090501d3e7',
        sequence: 1
      }),
      Resource.create({
        id: '56a1204886b2e565e1b2c230',
        sequence: 3
      }),
      Resource.create({
        id: '56a12048ddee2022a741356a',
        sequence: 2
      })
    ]
  });

  const reportData = ReportData.create({
    collection,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        profileName: 'Lorena Prendas Chavarria',
        lastFirstName: 'Chavarria, Lorena Prendas',
        profileCode: 'student-code-1',
        averageScore: 100,
        totalAnswered: 4,
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 100,
            answer: [{ value: 'answer' }]
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            answer: [{ value: 'answer' }]
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 100,
            answer: [{ value: 'answer' }]
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        profileName: 'Andres Charpentier Zuñiga',
        lastFirstName: 'Zuñiga, Andres Charpentier',
        profileCode: 'student-code-2',
        averageScore: 67,
        totalAnswered: 4,
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 100,
            answer: [{ value: 'answer' }]
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            answer: [{ value: 'answer' }]
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 0,
            answer: [{ value: 'answer' }]
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        profileName: 'David Zumbado Alfaro',
        lastFirstName: 'Alfaro, David Zumbado',
        profileCode: 'student-code-3',
        averageScore: 33,
        totalAnswered: 4,
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 100,
            answer: [{ value: 'answer' }]
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 0,
            answer: [{ value: 'answer' }]
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 0,
            answer: [{ value: 'answer' }]
          })
        ])
      })
    ]
  });

  this.set('reportData', reportData);
  this.render(
    hbs`{{reports/class-assessment/qz-student-view reportData=reportData student=reportData.reportEvents}}`
  );

  const $component = this.$();
  T.exists(assert, $component.find('.sort-section'), 'Sort section missing');
  const $avrgSortBtn = $component.find('.sort-section button.sort-average');
  const $alphabeticalSortBtn = $component.find(
    '.sort-section button.sort-alphabetical'
  );
  T.exists(assert, $avrgSortBtn, 'Missing sort by average');
  T.exists(assert, $alphabeticalSortBtn, 'Missing sort alphabetically');
  assert.equal(
    $component.find('.qz-student-performance-box').length,
    3,
    'It should displayed 3 boxes'
  );

  // let $firstStudentPerformanceBox = $component.find(
  //   '.qz-student-performance-box:last-child'
  // );
  //let $firstPanelHeading = $firstStudentPerformanceBox.find('.panel-heading');
  // assert.equal(
  //   T.text($firstPanelHeading.find('.name')),
  //   'Chavarria, Lorena Prendas',
  //   'Wrong first name'
  // );
  // assert.equal(
  //   T.text($firstPanelHeading.find('.score')),
  //   '100%',
  //   'Wrong first score'
  // );

  // let $lastStudentPerformanceBox = $component.find(
  //   '.qz-student-performance-box:first-child'
  // );
  //let $lastPanelHeading = $lastStudentPerformanceBox.find('.panel-heading');
  // assert.equal(
  //   T.text($lastPanelHeading.find('.name')),
  //   'Alfaro, David Zumbado',
  //   'Wrong last name'
  // );
  // assert.equal(
  //   T.text($lastPanelHeading.find('.score')),
  //   '33%',
  //   'Wrong last score'
  // );

  $alphabeticalSortBtn.click();

  // $firstStudentPerformanceBox = $component.find(
  //   '.qz-student-performance-box:first-child'
  // );
  //$firstPanelHeading = $firstStudentPerformanceBox.find('.panel-heading');
  // assert.equal(
  //   T.text($firstPanelHeading.find('.name')),
  //   'Alfaro, David Zumbado',
  //   'Wrong first alphabetical name'
  // );
  // assert.equal(
  //   T.text($firstPanelHeading.find('.score')),
  //   '33%',
  //   'Wrong first alphabetical score'
  // );

  // $lastStudentPerformanceBox = $component.find(
  //   '.qz-student-performance-box:last-child'
  // );
  // $lastPanelHeading = $lastStudentPerformanceBox.find('.panel-heading');
  // assert.equal(
  //   T.text($lastPanelHeading.find('.name')),
  //   'Zuñiga, Andres Charpentier',
  //   'Wrong last alphabetical name'
  // );
  // assert.equal(
  //   T.text($lastPanelHeading.find('.score')),
  //   '67%',
  //   'Wrong last alphabetical score'
  // );
});
