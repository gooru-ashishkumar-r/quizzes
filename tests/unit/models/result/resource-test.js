import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:result/resource', 'Unit | Model | result/resource');

test('attemptStatus', function(assert) {
  const resourceResult = this.subject({
    skipped: false,
    resource: Ember.Object.create({
      isResource: true
    })
  });
  assert.equal(
    resourceResult.get('attemptStatus'),
    'started',
    'The resource status should be skipped'
  );
  resourceResult.set('skipped', true);
  assert.equal(
    resourceResult.get('attemptStatus'),
    'skipped',
    'The resource status should be skipped'
  );
});

test('timeSpent', function(assert) {
  const resourceResult = this.subject({
    savedTime: 0,
    startTime: 0,
    stopTime: 2000
  });
  assert.equal(resourceResult.get('timeSpent'), 2000, 'Wrong time spent');

  resourceResult.set('startTime', 1000);
  assert.equal(resourceResult.get('timeSpent'), 1000, 'Wrong time spent');

  resourceResult.set('savedTime', 5000);
  assert.equal(resourceResult.get('timeSpent'), 6000, 'Wrong time spent');
});

test('timeSpentToSave', function(assert) {
  const resourceResult = this.subject({
    savedTime: 0,
    startTime: 0,
    stopTime: 2000
  });
  assert.equal(resourceResult.get('timeSpentToSave'), 2000, 'Wrong time spent');

  resourceResult.set('startTime', 1000);
  assert.equal(resourceResult.get('timeSpentToSave'), 1000, 'Wrong time spent');

  resourceResult.set('savedTime', 5000);
  assert.equal(resourceResult.get('timeSpentToSave'), 1000, 'Wrong time spent');
});

test('clear', function(assert) {
  const resourceResult = this.subject({
    savedTime: 20,
    startTime: 20,
    stopTime: 20,
    reaction: 2
  });
  resourceResult.clear();
  assert.equal(resourceResult.get('reaction'), 0, 'Wrong reaction');
  assert.equal(resourceResult.get('savedTime'), 0, 'Wrong saved time');
  assert.equal(resourceResult.get('startTime'), 0, 'Wrong start time');
  assert.equal(resourceResult.get('stopTime'), 0, 'Wrong stop time');
  assert.equal(resourceResult.get('timeSpent'), 0, 'Wrong time spent');
});

test('roundMilliseconds', function(assert) {
  const component = this.subject();
  assert.equal(component.roundMilliseconds(445010), 445000, 'Wrong rounded');
});

test('isCorrect', function(assert) {
  const resourceResult = this.subject({
    score: 0
  });
  assert.equal(resourceResult.get('isCorrect'), false, 'Should be incorrect');
  resourceResult.set('score', 100);
  assert.equal(resourceResult.get('isCorrect'), true, 'Should be correct');
});
