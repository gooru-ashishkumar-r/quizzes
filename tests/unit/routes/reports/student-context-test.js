import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';
import Collection from 'quizzes-addon/models/collection/collection';

moduleFor(
  'route:reports/student-context',
  'Unit | Route | reports/student context',
  {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  }
);

test('model', function(assert) {
  const route = this.subject();
  route.set('quizzesAttemptService', {
    getAttemptData: () =>
      new Ember.RSVP.resolve(
        ReportDataEvent.create({
          contextId: 'context-id',
          collectionId: 'collection-id'
        })
      ),
    getAttemptIds: () => new Ember.RSVP.resolve(['attempt-id'])
  });
  route.set('quizzesCollectionService', {
    readCollection: () =>
      new Ember.RSVP.resolve({
        id: 'collection-id'
      })
  });

  route.set('quizzesProfileService', {
    readUserProfile: () =>
      new Ember.RSVP.resolve({
        username: 'username'
      })
  });

  const expectedCollection = {
    id: 'collection-id'
  };
  const done = assert.async();
  route.model({ contextId: 'context-id' }).then(function(hash) {
    assert.ok(hash.attemptData, 'Attempt data is added to the model');
    assert.ok(hash.collection, 'Collection is added to the model');
    assert.deepEqual(
      hash.collection,
      expectedCollection,
      'Collection should match'
    );
    done();
  });
});

test('setupController', function(assert) {
  const route = this.subject();
  const controller = Ember.Object.create();
  const model = {
    attemptData: ReportDataEvent.create({
      id: 'context-id',
      profileId: 'profile-id',
      collection: null
    }),
    collection: Collection.create({
      id: 'collection-id'
    })
  };
  route.setupController(controller, model);
  assert.deepEqual(
    model.attemptData.profileId,
    'profile-id',
    'Profile id should match'
  );
  assert.deepEqual(
    model.attemptData.collection,
    model.collection,
    'Report data collection should be set'
  );
  assert.deepEqual(
    controller.attemptData,
    model.attemptData,
    'Attempt data should be set in the controller'
  );
});
