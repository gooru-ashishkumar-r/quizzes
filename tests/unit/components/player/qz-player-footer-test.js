import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Question from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'player/qz-player-footer',
  'Unit | Component | player/qz player footer',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('selectItem navigation disabled', function(assert) {
  assert.expect(0);
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  const item = {
    resource: question
  };
  component.set('isNavigationDisabled', true);
  component.set('sendAction', function() {
    assert.ok(false, 'Send action should not be called');
  });
  component.send('selectItem', item);
});

test('selectItem no resource', function(assert) {
  assert.expect(0);
  const component = this.subject();
  const item = {};
  component.set('sendAction', function() {
    assert.ok(false, 'Send action should not be called');
  });
  component.send('selectItem', item);
});

test('selectItem with item selected', function(assert) {
  assert.expect(1);
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  const item = {
    resource: question
  };
  component.set('onItemSelected', {});
  component.set('sendAction', function(actionName, resource) {
    if (actionName === 'onItemSelected') {
      assert.deepEqual(resource, question, 'Resource param should match');
    }
  });
  component.send('selectItem', item);
});

test('selectItem with no item selected', function(assert) {
  assert.expect(1);
  const component = this.subject();
  const question = Question.create(Ember.getOwner(this).ownerInjection());
  const item = {
    resource: question
  };
  component.set('onItemSelected', 'onItemSelected');
  component.set('sendAction', function(actionName) {
    if (actionName === 'onItemSelected') {
      assert.ok(true, 'On item selected action should not be sent');
    }
  });
  component.send('selectItem', item);
});

test('seeUsageReport', function(assert) {
  const component = this.subject();
  component.set('sendAction', function(actionName) {
    assert.equal(actionName, 'onFinishCollection', 'Action sent should match');
  });
  component.send('seeUsageReport');
});

test('finishCollection', function(assert) {
  const component = this.subject();
  component.set('sendAction', function(actionName) {
    assert.equal(actionName, 'onFinishCollection', 'Action sent should match');
  });
  component.send('finishCollection');
});
