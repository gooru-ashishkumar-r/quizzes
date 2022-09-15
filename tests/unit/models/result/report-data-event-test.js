import Ember from 'ember';
import QuestionResult from 'quizzes-addon/models/result/question';
import ResourceResult from 'quizzes-addon/models/result/resource';
import Profile from 'quizzes-addon/models/profile/profile';
import { moduleFor, test } from 'ember-qunit';

moduleFor(
  'model:result/report-data-event',
  'Unit | Model | result/report-data-event'
);

test('questionResults', function(assert) {
  const contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create(),
      ResourceResult.create(),
      QuestionResult.create()
    ])
  });

  assert.equal(
    contextResult.get('questionResults').length,
    1,
    'Wrong question results'
  );
});

test('generate profileCode without studentId', function(assert) {
  let contextResult = this.subject({
    profileId: 'test-profile-id'
  });
  assert.equal(contextResult.get('profileCode'), 'test', 'Wrong profile code');
});

test('generate profileCode with studentId', function(assert) {
  let contextResult = this.subject({
    profileId: 'test-profile-id',
    studentId: 'gcc'
  });
  assert.equal(contextResult.get('profileCode'), 'gcc', 'Wrong profile code');
});

test('setProfileProperties', function(assert) {
  let contextResult = this.subject({
    profileId: 'profile-id',
    studentId: 'gcc001'
  });
  contextResult.setProfileProperties(
    Profile.create({
      firstName: 'first-name',
      lastName: 'last-name',
      studentId: 'gcc001'
    })
  );

  assert.equal(
    contextResult.get('profileName'),
    'first-name last-name',
    'Wrong profile name'
  );
  assert.equal(
    contextResult.get('studentId'),
    'gcc001',
    'Wrong profile student id'
  );

  assert.equal(
    contextResult.get('lastFirstName'),
    'last-name, first-name',
    'Wrong profile name format'
  );
});

test('totalIncorrect', function(assert) {
  const contextResult = this.subject({
    totalAnswered: 12,
    totalCorrect: 10
  });
  assert.equal(
    contextResult.get('totalIncorrect'),
    2,
    'Wrong first total incorrect'
  );
  contextResult.set('totalCorrect', 2);
  assert.equal(
    contextResult.get('totalIncorrect'),
    10,
    'Wrong second total incorrect'
  );
  contextResult.set('totalAnswered', 2);
  assert.equal(
    contextResult.get('totalIncorrect'),
    0,
    'Wrong third total incorrect'
  );
});

test('setProfileSummary', function(assert) {
  const contextResult = this.subject({
    profileId: 'profile-id'
  });
  const summary = {
    totalAnswered: 10,
    totalCorrect: 7,
    averageReaction: 2,
    averageScore: 90,
    totalTimeSpent: 1000
  };
  assert.equal(
    contextResult.get('totalAnswered'),
    0,
    'Wrong before call total answered'
  );
  assert.equal(
    contextResult.get('totalCorrect'),
    0,
    'Wrong before call total correct'
  );
  assert.equal(
    contextResult.get('totalTimeSpent'),
    0,
    'Wrong before call total time spent'
  );
  assert.equal(
    contextResult.get('averageReaction'),
    0,
    'Wrong before call average reaction'
  );
  assert.equal(
    contextResult.get('averageScore'),
    0,
    'Wrong before call average score'
  );
  assert.notOk(
    contextResult.get('isAttemptFinished'),
    'Wrong before call is attempt finished'
  );
  contextResult.setProfileSummary(summary, true);
  assert.equal(contextResult.get('totalAnswered'), 10, 'Wrong total answered');
  assert.equal(contextResult.get('totalCorrect'), 7, 'Wrong total correct');
  assert.equal(
    contextResult.get('totalTimeSpent'),
    1000,
    'Wrong total time spent'
  );
  assert.equal(
    contextResult.get('averageReaction'),
    2,
    'Wrong average reaction'
  );
  assert.equal(contextResult.get('averageScore'), 90, 'Wrong average score');
  assert.ok(
    contextResult.get('isAttemptFinished'),
    'Wrong is attempt finished'
  );
});

test('findIndexByResourceId', function(assert) {
  const contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create({
        resourceId: 'id1'
      }),
      ResourceResult.create({
        resourceId: 'id2'
      }),
      QuestionResult.create({
        resourceId: 'id3'
      })
    ])
  });

  assert.equal(
    contextResult.findIndexByResourceId('id2'),
    1,
    'Wrong resource index'
  );
});

test('merge with saved time', function(assert) {
  const contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create({
        resourceId: 'id1'
      }),
      ResourceResult.create({
        resourceId: 'id2'
      }),
      QuestionResult.create({
        resourceId: 'id3'
      })
    ])
  });

  const newResult = QuestionResult.create({
    resourceId: 'new',
    savedTime: 10,
    reaction: 1,
    answer: 'answer',
    score: 0
  });
  contextResult.merge('id3', newResult);

  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('resourceId'),
    'new',
    'Wrong resource id'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('savedTime'),
    10,
    'Wrong saved time'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('startTime'),
    0,
    'Wrong start time'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('stopTime'),
    0,
    'Wrong stop time'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('reaction'),
    1,
    'Wrong reaction'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('answer'),
    'answer',
    'Wrong answer'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('score'),
    0,
    'Wrong score'
  );
});

test('merge with time spent', function(assert) {
  const contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create({
        resourceId: 'id1'
      }),
      ResourceResult.create({
        resourceId: 'id2'
      }),
      QuestionResult.create({
        resourceId: 'id3'
      })
    ])
  });

  const newResult = QuestionResult.create({
    resourceId: 'new',
    timeSpent: 10,
    reaction: 1,
    answer: 'answer',
    score: 0
  });
  contextResult.merge('id3', newResult);

  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('resourceId'),
    'new',
    'Wrong resource id'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('savedTime'),
    10,
    'Wrong saved time'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('startTime'),
    0,
    'Wrong start time'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('stopTime'),
    0,
    'Wrong stop time'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('reaction'),
    1,
    'Wrong reaction'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('answer'),
    'answer',
    'Wrong answer'
  );
  assert.equal(
    contextResult
      .get('resourceResults')
      .get(2)
      .get('score'),
    0,
    'Wrong score'
  );
});
