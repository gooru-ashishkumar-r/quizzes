import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Resource from 'quizzes-addon/models/resource/resource';

moduleFor(
  'model:collection/collection',
  'Unit | Model | collection/collection',
  {
    unit: true
  }
);

test('resourcesSorted', function(assert) {
  assert.expect(3);
  const model = this.subject({
    resources: Ember.A([
      Resource.create({ id: 'resource-1', sequence: 1 }),
      Resource.create({ id: 'resource-2', sequence: 3 }),
      Resource.create({ id: 'resource-3', sequence: 2 })
    ])
  });

  assert.equal(
    model.get('resourcesSorted')[0].get('id'),
    'resource-1',
    'Wrong first resource'
  );
  assert.equal(
    model.get('resourcesSorted')[1].get('id'),
    'resource-3',
    'Wrong second resource'
  );
  assert.equal(
    model.get('resourcesSorted')[2].get('id'),
    'resource-2',
    'Wrong third resource'
  );
});

test('isAssessment', function(assert) {
  assert.expect(1);
  const model = this.subject({
    isCollection: false
  });

  assert.ok(model.get('isAssessment'), 'Should return true');
});

test('hasResources empty', function(assert) {
  assert.expect(1);
  const model = this.subject({
    resources: Ember.A()
  });
  assert.ok(!model.get('hasResources'), 'Should return false');
});

test('hasResources not empty', function(assert) {
  assert.expect(1);

  var resources = Ember.A();
  Ember.run(function() {
    resources.pushObject(Ember.Object.create({ id: 1 }));
  });
  const model = this.subject({
    resources: resources
  });

  assert.ok(model.get('hasResources'), 'Should return true');
});

test('prevResource without resources', function(assert) {
  assert.expect(1);
  var resource = null;
  Ember.run(function() {
    resource = Ember.Object.create({ id: 1 });
  });

  const model = this.subject({
    resources: Ember.A()
  });

  var prevResource = model.prevResource(resource);
  assert.ok(!prevResource, 'Resource should not be found');
});

test('prevResource', function(assert) {
  assert.expect(3);

  var resources = Ember.A(),
    resourceA = null,
    resourceB = null;

  Ember.run(function() {
    resourceA = Ember.Object.create({ id: 1 });
    resourceB = Ember.Object.create({ id: 2 });

    resources.pushObject(resourceA);
    resources.pushObject(resourceB);
  });
  const model = this.subject({
    resources: resources
  });

  var prevResource = model.prevResource(resourceB);
  assert.ok(prevResource, 'Resource should be found');
  assert.equal(prevResource.get('id'), 1, 'Wrong resource id');

  prevResource = model.prevResource(resourceA);
  assert.ok(!prevResource, 'Resource should not be found');
});

test('nextResource without resources', function(assert) {
  assert.expect(1);

  var resource = null;
  Ember.run(function() {
    resource = Ember.Object.create({ id: 1 });
  });

  const model = this.subject({
    resources: Ember.A()
  });

  var nextResource = model.nextResource(resource);
  assert.ok(!nextResource, 'Resource should not be found');
});

test('nextResource', function(assert) {
  assert.expect(3);

  var resources = Ember.A(),
    resourceA = null,
    resourceB = null;

  Ember.run(function() {
    resourceA = Ember.Object.create({ id: 1 });
    resourceB = Ember.Object.create({ id: 2 });

    resources.pushObject(resourceA);
    resources.pushObject(resourceB);
  });
  const model = this.subject({
    resources: resources
  });

  var nextResource = model.nextResource(resourceA);
  assert.ok(nextResource, 'Resource should be found');
  assert.equal(nextResource.get('id'), 2, 'Wrong resource id');

  nextResource = model.nextResource(resourceB);
  assert.ok(!nextResource, 'Resource should not be found');
});

test('getResourceById without resources', function(assert) {
  assert.expect(1);

  const model = this.subject({
    resources: Ember.A()
  });

  var nextResource = model.getResourceById(1);
  assert.ok(!nextResource, 'Resource should not be found');
});

test('getResourceById', function(assert) {
  assert.expect(2);

  const resources = Ember.A([
    Ember.Object.create({ id: '1' }),
    Ember.Object.create({ id: '2' })
  ]);
  const model = this.subject({ resources });
  const resource = model.getResourceById('1');
  assert.ok(resource, 'Resource should be found');
  assert.equal(resource.get('id'), '1', 'Wrong resource id');
});

test('isLastResource', function(assert) {
  assert.expect(2);

  var resources = Ember.A(),
    resourceA = null,
    resourceB = null;

  Ember.run(function() {
    resourceA = Ember.Object.create({ id: 1 });
    resourceB = Ember.Object.create({ id: 2 });

    resources.pushObject(resourceA);
    resources.pushObject(resourceB);
  });
  const model = this.subject({ resources });

  var lastResource = model.isLastResource(resourceB);
  assert.ok(lastResource, 'It is not the last resource');

  lastResource = model.isLastResource(resourceA);
  assert.ok(!lastResource, 'It is the last resource');
});

test('attempts', function(assert) {
  assert.expect(1);
  const model = this.subject({
    settings: { attempts: 1 }
  });

  assert.equal(model.get('attempts'), 1, 'Incorrect attempts');
});

test('showKey', function(assert) {
  assert.expect(1);
  const model = this.subject({
    settings: { showKey: true }
  });

  assert.equal(model.get('showKey'), true, 'Should be true');
});

test('immediateFeedback', function(assert) {
  assert.expect(1);
  const model = this.subject({
    settings: { showFeedback: 'immediate' }
  });

  assert.equal(
    model.get('immediateFeedback'),
    true,
    'Should be immediate feedback'
  );
});

test('showFeedback', function(assert) {
  assert.expect(1);
  const model = this.subject({
    settings: { showFeedback: 'summary' }
  });

  assert.equal(
    model.get('showFeedback'),
    'summary',
    'Show feedback should be summary'
  );
});

test('bidirectional', function(assert) {
  assert.expect(1);
  const model = this.subject({
    settings: { bidirectional: true }
  });

  assert.equal(
    model.get('bidirectional'),
    true,
    'Bidirectional should be true'
  );
});
