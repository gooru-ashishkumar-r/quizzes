import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';

moduleForService(
  'service:quizzes/api-sdk/collection',
  'Unit | Service | quizzes/api-sdk/collection'
);

test('readCollection', function(assert) {
  const service = this.subject();
  const expectedCollectionId = 'collection-id';
  const expectedType = 'collection';
  assert.expect(4);

  service.set(
    'collectionAdapter',
    Ember.Object.create({
      readCollection: function(collectionId, type, refresh) {
        assert.equal(collectionId, expectedCollectionId, 'Wrong Collection id');
        assert.equal(type, expectedType, 'Wrong Collection type');
        assert.equal(refresh, false, 'Wrong refresh');
        return Ember.RSVP.resolve({ id: collectionId });
      }
    })
  );

  service.set(
    'collectionSerializer',
    Ember.Object.create({
      normalizeReadCollection: function(collectionData) {
        assert.deepEqual(
          collectionData,
          { id: expectedCollectionId },
          'Wrong Collection data'
        );
        return {};
      }
    })
  );

  var done = assert.async();
  service.readCollection(expectedCollectionId, expectedType).then(done);
});

test('notifyCollectionChange', function(assert) {
  const service = this.subject();
  const expectedCollectionId = 'collection-id';
  const expectedType = 'collection';
  assert.expect(3);

  service.set('readCollection', function(collectionId, type, refresh) {
    assert.equal(collectionId, expectedCollectionId, 'Wrong Collection id');
    assert.equal(type, expectedType, 'Wrong Collection type');
    assert.equal(refresh, true, 'Wrong refresh');
    return Ember.RSVP.resolve({ id: collectionId });
  });

  var done = assert.async();
  service.notifyCollectionChange(expectedCollectionId, expectedType).then(done);
});
