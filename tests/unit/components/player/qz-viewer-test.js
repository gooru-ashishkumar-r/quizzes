import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Question from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';
import { QUIZZES_RESOURCE_TYPES } from 'quizzes-addon/config/quizzes-config';

moduleForComponent('player/qz-viewer', 'Unit | Component | player/qz viewer', {
  unit: true
});

test('buttonTextKey when is not the last resource', function(assert) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      id: 1,
      type: QUIZZES_RESOURCE_TYPES.url
    }),
    collection: Ember.Object.create({
      isLastResource: () => false
    })
  });

  assert.equal(
    component.get('buttonTextKey'),
    'common.save-next',
    'Wrong button text key'
  );
});

test('buttonTextKey when is the last resource and assessment', function(
  assert
) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      id: 1,
      type: QUIZZES_RESOURCE_TYPES.url
    }),
    collection: Ember.Object.create({
      isLastResource: () => true,
      isAssessment: true
    })
  });

  assert.equal(
    component.get('buttonTextKey'),
    'common.save-submit',
    'Wrong button text key'
  );
});

test('buttonTextKey when is the last resource and collection', function(
  assert
) {
  assert.expect(1);

  var component = this.subject({
    resource: Ember.Object.create({
      id: 1,
      type: QUIZZES_RESOURCE_TYPES.url
    }),
    collection: Ember.Object.create({
      isLastResource: () => true,
      isAssessment: false
    })
  });

  assert.equal(
    component.get('buttonTextKey'),
    'common.save-finish',
    'Wrong button text key'
  );
});

test('submitQuestion', function(assert) {
  assert.expect(3);
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  component.set('sendAction', function(actionName, q, result) {
    assert.equal(actionName, 'onSubmitQuestion', 'Action sent should match');
    assert.deepEqual(q, question, 'Question should match');
    assert.deepEqual(result, questionResult, 'QuestionResult should match');
  });
  component.set('$', function() {
    return { scrollTop: () => 0 };
  });
  component.send('submitQuestion', question, questionResult);
});
test('previousResource', function(assert) {
  assert.expect(1);
  const component = this.subject();
  const question = Question.create({
    id: '1',
    type: 'question',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true,
    isResource: false
  });
  component.set('sendAction', function(actionName) {
    assert.equal(actionName, 'onPreviousResource', 'Action sent should match');
  });
  component.set('$', function() {
    return { scrollTop: () => 0 };
  });
  component.send('previousResource', question);
});
