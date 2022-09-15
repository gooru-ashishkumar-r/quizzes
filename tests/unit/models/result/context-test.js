import Ember from 'ember';
import QuestionResult from 'quizzes-addon/models/result/question';
import ResourceResult from 'quizzes-addon/models/result/resource';
import Resource from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/context', 'Unit | Model | result/context');

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

test('nonOpenEndedQuestionResults', function(assert) {
  const contextResult = this.subject({
    resourceResults: Ember.A([
      QuestionResult.create({
        resource: Resource.create({ type: QUESTION_TYPES.trueFalse })
      }),
      QuestionResult.create({
        resource: Resource.create({ type: QUESTION_TYPES.fib })
      }),
      QuestionResult.create({
        resource: Resource.create({ type: QUESTION_TYPES.openEnded })
      })
    ])
  });

  assert.equal(
    contextResult.get('nonOpenEndedQuestionResults').length,
    2,
    'Wrong question results'
  );
});

test('totalResources', function(assert) {
  const contextResult = this.subject({
    resourceResults: Ember.A([1, 2])
  });

  assert.equal(contextResult.get('totalResources'), 2, 'Wrong total resources');
});

test('currentResult', function(assert) {
  const contextResult = this.subject({
    currentResourceId: 2,
    resourceResults: Ember.A([
      ResourceResult.create({ resourceId: 1 }),
      QuestionResult.create({ resourceId: 2 }),
      QuestionResult.create({ resourceId: 3 })
    ])
  });

  assert.equal(
    contextResult.get('currentResult').get('resourceId'),
    2,
    'Wrong result'
  );
});

test('getResultByResourceId', function(assert) {
  const contextResult = this.subject({
    resourceResults: Ember.A([
      ResourceResult.create({ resourceId: 1 }),
      QuestionResult.create({ resourceId: 2 }),
      QuestionResult.create({ resourceId: 3 })
    ])
  });

  assert.equal(
    contextResult.getResultByResourceId(1).get('resourceId'),
    1,
    'Wrong result'
  );
});
