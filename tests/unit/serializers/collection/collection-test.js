import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor(
  'serializer:collection/collection',
  'Unit | Serializer | collection/collection'
);

test('normalizeReadCollection', function(assert) {
  const serializer = this.subject();
  const collectionData = {
    id: 'collection-id',
    isCollection: true,
    resources: null,
    ownerId: '1234'
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.ok(collection.get('isCollection'), 'Wrong value for isCollection');
  assert.equal(
    collection.get('resources').length,
    0,
    'Wrong size for resources'
  );
  assert.equal(collection.get('ownerId'), '1234', 'Wrong ownerId');
});

test('normalizeReadCollection with resources', function(assert) {
  const serializer = this.subject();
  serializer.set('resourceSerializer', {
    normalizeReadResource: ({ id, sequence }) =>
      Ember.Object.create({
        id: `${id}-normalized`,
        sequence
      })
  });
  const collectionData = {
    id: 'collection-id',
    isCollection: false,
    resources: [
      {
        id: 'resource1',
        sequence: 1
      },
      {
        id: 'resource2',
        sequence: 2
      }
    ]
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('id'), 'collection-id', 'Wrong id');
  assert.notOk(collection.get('isCollection'), 'Wrong value for isCollection');
  assert.equal(
    collection.get('resources').length,
    2,
    'Wrong size for resources'
  );
  assert.equal(
    collection.get('resources')[0].get('id'),
    'resource1-normalized',
    'Wrong value for resource'
  );
});

test('normalizeReadCollection with settings and title', function(assert) {
  const serializer = this.subject();
  const collectionData = {
    id: 'collection-id',
    isCollection: false,
    metadata: {
      title: 'collection-title',
      setting: {
        show_key: 'never'
      }
    }
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(collection.get('showKey'), false, 'Should be false');
  assert.equal(collection.get('title'), 'collection-title', 'Should be false');

  const collectionData2 = {
    id: 'collection-id',
    isCollection: false,
    metadata: {
      setting: {
        show_key: 'summary',
        attempts_allowed: -1,
        bidirectional_play: true,
        show_feedback: 'never'
      }
    }
  };

  const collection2 = serializer.normalizeReadCollection(collectionData2);
  assert.equal(collection2.get('showKey'), true, 'Should be true');
  assert.equal(collection2.get('attempts'), -1, 'Incorrect attempts');
  assert.equal(
    collection2.get('bidirectional'),
    true,
    'Bidirectional should be true'
  );
  assert.equal(
    collection2.get('showFeedback'),
    'never',
    'showFeedback should be never'
  );
});

test('normalizeReadCollection with no settings', function(assert) {
  const serializer = this.subject();
  const collectionData = {
    id: 'collection-id',
    isCollection: false,
    metadata: {
      title: 'collection-title'
    }
  };
  const collection = serializer.normalizeReadCollection(collectionData);
  assert.equal(
    collection.get('title'),
    'collection-title',
    'Title should match'
  );
  assert.equal(collection.get('showKey'), false, 'Should be false');
  assert.equal(collection.get('attempts'), -1, 'Incorrect attempts');
  assert.equal(
    collection.get('bidirectional'),
    false,
    'Bidirectional should be false'
  );
  assert.equal(
    collection.get('showFeedback'),
    'summary',
    'showFeedback value should be summary'
  );
});
