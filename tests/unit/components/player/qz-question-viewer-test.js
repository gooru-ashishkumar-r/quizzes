import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Question from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';

moduleForComponent(
  'player/qz-question-viewer',
  'Unit | Component | player/qz question viewer',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('changeAnswer', function(assert) {
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  component.send('changeAnswer', question);
  assert.deepEqual(
    component.question,
    question,
    'Question object should match'
  );
});

test('clearAnswer', function(assert) {
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  component.send('clearAnswer', question);
  assert.deepEqual(
    component.question,
    question,
    'Question object should match'
  );
  assert.notOk(component.answerCompleted, 'answerCompleted should be updated');
});

test('completeAnswer', function(assert) {
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const answer = 'answer';
  component.set('questionResult', questionResult);
  component.send('completeAnswer', question, answer);
  assert.deepEqual(
    component.question,
    question,
    'Question object should match'
  );
  assert.equal(
    questionResult.answer,
    answer,
    'Question result answer should be updated'
  );
  assert.ok(component.answerCompleted, 'answerCompleted should be updated');
});

test('loadedAnswer', function(assert) {
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const answer = 'answer';
  component.set('questionResult', questionResult);
  component.send('loadedAnswer', question, answer);
  //return wait().then(function() {
  assert.deepEqual(
    component.question,
    question,
    'Question object should match'
  );
  assert.equal(
    questionResult.answer,
    answer,
    'Question result answer should be updated'
  );
  assert.notOk(component.answerCompleted, 'answerCompleted should be updated');
  // });
});

test('showExplanation', function(assert) {
  const component = this.subject();
  component.send('showExplanation');
  assert.ok(
    component.isExplanationShown,
    'isExplanationShown should be updated'
  );
});

test('showHint', function(assert) {
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection(), {
    hints: ['hint0', 'hint1']
  });
  component.set('question', question);
  component.set('actualHint', 1);
  component.send('showHint');
  assert.equal(component.get('actualHint'), 2, 'actualHint should be updated');
  assert.ok(
    component.get('hintsToDisplay').indexOf('hint1') > -1,
    'Hint should be added to display'
  );
});

test('submitQuestion', function(assert) {
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  component.set('question', question);
  component.set('questionResult', questionResult);
  component.set('sendAction', function(actionName, q, result) {
    assert.equal(actionName, 'onSubmitQuestion', 'Action sent should match');
    assert.deepEqual(q, question, 'Question should match');
    assert.deepEqual(result, questionResult, 'QuestionResult should match');
  });
  component.send('submitQuestion');
});

test('reloadQuestion', function(assert) {
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  const question2 = Question.create(Ember.getOwner(this).ownerInjection());
  component.set('question', question);
  component.setProperties({
    actualHint: 5,
    answerCompleted: true,
    hintsToDisplay: '',
    isExplanationShown: true
  });
  component.set('question', question2);
  assert.equal(
    component.get('actualHint'),
    0,
    'Actual hint should be updated.'
  );
  assert.equal(
    component.get('answerCompleted'),
    false,
    'Answer completed hint should be updated.'
  );
  assert.ok(
    component.get('hintsToDisplay').length === 0,
    'Hints to display should be updated.'
  );
  assert.equal(
    component.get('isExplanationShown'),
    false,
    'Is explanation shown should be updated.'
  );
});
