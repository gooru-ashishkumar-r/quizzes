import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'gru-assignments-detail',
  'Unit | Component | gru assignments detail',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('addStudent', function(assert) {
  const component = this.subject();
  const expectedModel = {
    students: [],
    assignment: 'assignment',
    width: '95%'
  };
  component.set('assignment', 'assignment');
  component.set('students', 'students');
  component.set('actions.showModal', function(componentName, model) {
    assert.deepEqual(model, expectedModel, 'Model should match');
    assert.equal(
      componentName,
      'gru-assign-student-modal',
      'Component name should match'
    );
  });
  component.send('addStudent');
});

test('openRealTime', function(assert) {
  const component = this.subject();
  component.set(
    'assignment',
    Ember.Object.create({
      id: 'id'
    })
  );
  component.set('router', {
    transitionTo: function(route, contextId) {
      assert.equal(route, 'reports.context', 'Route should match');
      assert.equal(contextId, 'id', 'id should match');
    }
  });
  component.send('openRealTime');
});

test('openPlayer', function(assert) {
  const done = assert.async();
  const component = this.subject();
  const assignment = Ember.Object.create({
    id: 'id'
  });
  component.set('router', {
    transitionTo: function(route, contextId) {
      assert.equal(route, 'player', 'Route should match');
      assert.equal(contextId, 'id', 'id should match');
      done();
    }
  });
  component.send('openPlayer', assignment);
});

test('hasAttempts', function(assert) {
  const component = this.subject();
  component.set(
    'assignment',
    Ember.Object.create({
      totalAttempts: 10,
      attempts: 9
    })
  );
  assert.ok(component.get('hasAttempts'), 'Should have attempts left');
  component.set(
    'assignment',
    Ember.Object.create({
      totalAttempts: 10,
      attempts: 10
    })
  );
  assert.notOk(component.get('hasAttempts'), 'Should not have attempts left');
});
