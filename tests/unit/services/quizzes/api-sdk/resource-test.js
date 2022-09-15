import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';

moduleForService(
  'service:quizzes/api-sdk/resource',
  'Unit | Service | quizzes/api-sdk/resource'
);

test('sendFinishResource', function(assert) {
  assert.expect(7);
  const service = this.subject();
  const expectedData = 'data';
  const expectedContext = 'context';
  const expectedResult = 'result';
  const resourceId = 'resource-id';
  service.set(
    'resourceAdapter',
    Ember.Object.create({
      sendFinishResource: function(id, data, context) {
        assert.equal(id, resourceId, 'Wrong adapter resource id');
        assert.equal(data, expectedData, 'Wrong adapter event data');
        assert.equal(context, expectedContext, 'Wrong adapter event context');
        return Ember.RSVP.resolve({});
      }
    })
  );
  service.set(
    'contextSerializer',
    Ember.Object.create({
      serializeResourceResult: (result, withResourceId) => {
        assert.equal(result, expectedResult, 'Resource result should match');
        assert.notOk(withResourceId, 'Expected to be false');
        return expectedData;
      },
      serializeEventContext: eventContext => {
        assert.deepEqual(
          eventContext,
          expectedContext,
          'event context shoudl match'
        );
        return expectedContext;
      }
    })
  );

  const done = assert.async();
  service
    .sendFinishResource(resourceId, expectedResult, expectedContext)
    .then(response => {
      assert.deepEqual(response, {}, 'Wrong response');
      done();
    });
});

test('readResource', function(assert) {
  assert.expect(3);
  const service = this.subject();
  const expectedData = 'data';
  const resourceId = 'resource-id';
  service.set(
    'resourceAdapter',
    Ember.Object.create({
      readResource: function(data) {
        assert.deepEqual(data, resourceId, 'Wrong adapter resource id');
        return Ember.RSVP.resolve({});
      }
    })
  );
  service.set(
    'resourceSerializer',
    Ember.Object.create({
      normalizeReadResource: function(resource) {
        assert.ok(resource, 'Wrong resource object');
        return expectedData;
      }
    })
  );

  const done = assert.async();
  service.readResource(resourceId).then(response => {
    assert.deepEqual(response, expectedData, 'Wrong response');
    done();
  });
});
