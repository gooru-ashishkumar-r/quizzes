import {
  sortFeaturedCourses,
  getSubjects
} from 'quizzes-addon/utils/sort-featured-courses';
import Ember from 'ember';
import { module, test } from 'qunit';

module('Unit | Utility | sort featured courses');

// Replace this with your real tests.
test('getSubjects and sort Courses', function(assert) {
  const courses = Ember.A([
    Ember.Object.create({
      id: 'choice-1',
      subject: 'K-12.M',
      subjectSequence: 2,
      sequence: 2,
      subjectName: 'Math'
    }),
    Ember.Object.create({
      id: 'choice-2',
      subject: 'K-12.SC',
      subjectName: 'Science',
      subjectSequence: 1,
      sequence: 1
    }),
    Ember.Object.create({
      id: 'choice-3',
      subject: 'K-12.EL',
      subjectName: 'English Language',
      subjectSequence: 3,
      sequence: 1
    }),
    Ember.Object.create({
      id: 'choice-4',
      subject: 'K-12.M',
      subjectName: 'Math',
      subjectSequence: 2,
      sequence: 3
    }),
    Ember.Object.create({
      id: 'choice-5',
      subject: 'K-12.EL',
      subjectName: 'English Language',
      subjectSequence: 3,
      sequence: 2
    }),
    Ember.Object.create({
      id: 'choice-6',
      subject: 'K-12.M',
      subjectSequence: 2,
      subjectName: 'Math',
      sequence: 1
    }),
    Ember.Object.create({
      id: 'choice-7',
      subject: 'K-12.SC',
      subjectName: 'Science',
      subjectSequence: 1,
      sequence: 2
    })
  ]);

  const orderedSubjects = getSubjects(courses);
  const orderedCourses = sortFeaturedCourses(courses);

  assert.equal(orderedSubjects.length, 4, 'Wrong amount of subjects');
  assert.equal(
    orderedSubjects[0].subject,
    '',
    'Empty subject for courses with no taxonomy information'
  );
  assert.equal(orderedSubjects[1].subject, 'K-12.SC', 'Second subject');
  assert.equal(orderedSubjects[2].subject, 'K-12.M', 'Third subject');
  assert.equal(orderedSubjects[3].subject, 'K-12.EL', 'Fourth subject');

  assert.equal(orderedCourses.length, 4, 'Courses buckets');
  assert.equal(orderedCourses[0].length, 0, 'Course bucket 1');
  assert.equal(orderedCourses[1].length, 2, 'Course bucket 2');
  assert.equal(orderedCourses[2].length, 3, 'Course bucket 3');
  assert.equal(orderedCourses[3].length, 2, 'Course bucket 4');

  for (let i = orderedCourses.length - 1; i > 0; i--) {
    for (var o = 0; o < orderedCourses[o].length; o++) {
      assert.equal(orderedCourses[i][o].sequence, o, 'Wrong subject order');
    }
  }
});
