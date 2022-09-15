import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/question', 'Unit | Model | result/question');

test('attemptStatus', function(assert) {
  const resourceResult = this.subject({
    score: 100,
    skipped: false,
    resource: Ember.Object.create({
      isResource: false
    })
  });
  assert.equal(
    resourceResult.get('attemptStatus'),
    'correct',
    'The status should be correct'
  );
  resourceResult.set('score', 0);
  assert.equal(
    resourceResult.get('attemptStatus'),
    'incorrect',
    'The status should be incorrect'
  );
  resourceResult.set('resource.isOpenEnded', true);
  assert.equal(
    resourceResult.get('attemptStatus'),
    'started',
    'The question status should be started'
  );
  resourceResult.set('skipped', true);
  assert.equal(
    resourceResult.get('attemptStatus'),
    'skipped',
    'The status should be skipped'
  );
  resourceResult.set('resource.isOpenEnded', false);
  assert.equal(
    resourceResult.get('attemptStatus'),
    'skipped',
    'The status should be skipped'
  );
  resourceResult.set('resource.isResource', true);
  assert.equal(
    resourceResult.get('attemptStatus'),
    'skipped',
    'The resource status should be skipped'
  );
  resourceResult.set('skipped', false);
  assert.equal(
    resourceResult.get('attemptStatus'),
    'started',
    'The resource status should be started'
  );
});

test('clear', function(assert) {
  const resourceResult = this.subject({
    answer: [],
    score: 100,
    reaction: 2,
    savedTime: 20,
    startTime: 20,
    stopTime: 20
  });
  resourceResult.clear();
  assert.notOk(resourceResult.get('answer'), 'Wrong answer');
  assert.equal(resourceResult.get('score'), 0, 'Wrong score');
  assert.equal(resourceResult.get('reaction'), 0, 'Wrong reaction');
  assert.equal(resourceResult.get('savedTime'), 0, 'Wrong saved time');
  assert.equal(resourceResult.get('startTime'), 0, 'Wrong start time');
  assert.equal(resourceResult.get('stopTime'), 0, 'Wrong stop time');
  assert.equal(resourceResult.get('timeSpent'), 0, 'Wrong time spent');
});

test('correct/incorrect', function(assert) {
  const resourceResult = this.subject({
    score: 100
  });
  assert.ok(resourceResult.get('correct'), 'Correct should be true');
  assert.notOk(resourceResult.get('incorrect'), 'Incorrect should be false');
  resourceResult.set('score', 0);
  assert.notOk(resourceResult.get('correct'), 'Correct should be false');
  assert.ok(resourceResult.get('incorrect'), 'Incorrect should be true');
});

test('started', function(assert) {
  const resourceResult = this.subject();
  assert.notOk(resourceResult.get('started'), 'Started should be false');
  resourceResult.set('answer', [{}]);
  assert.ok(resourceResult.get('started'), 'Started should be true');
});

test('isOpenEnded', function(assert) {
  const resource = Ember.Object.create({
    isOpenEnded: false
  });
  const resourceResult = this.subject({ resource });
  assert.notOk(
    resourceResult.get('isOpenEnded'),
    'isOpenEnded should be false'
  );
  resource.set('isOpenEnded', true);
  assert.ok(resourceResult.get('isOpenEnded'), 'isOpenEnded should be true');
});
