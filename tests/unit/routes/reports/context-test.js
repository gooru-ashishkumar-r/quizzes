import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Profile from 'quizzes-addon/models/profile/profile';
import Collection from 'quizzes-addon/models/collection/collection';
import ReportData from 'quizzes-addon/models/result/report-data';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';

moduleFor(
  'route:reports/context',
  'Unit | Route | reports/context',
  {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  }
);

test('model', function(assert) {
  const route = this.subject();
  route.set('quizzesAttemptService', {
    getReportData: () =>
      new Ember.RSVP.resolve(
        ReportData.create({
          id: 'context-id',
          collectionId: 'collection-id',
          reportEvents: [
            {
              profileId: 'profile1'
            },
            {
              profileId: 'profile2'
            }
          ]
        })
      )
  });
  route.set('quizzesCollectionService', {
    readCollection: () =>
      new Ember.RSVP.resolve({
        id: 'collection-id'
      })
  });
  route.set('quizzesProfileService', {
    readProfiles: () => new Ember.RSVP.resolve('profiles')
  });

  const expectedCollection = {
    id: 'collection-id'
  };
  const done = assert.async();
  route
    .model({
      contextId: 'context-id',
      students: [Ember.Object.create({ id: 'profile3' })]
    })
    .then(hash => {
      assert.ok(hash.reportData, 'Report data is added to the model');
      assert.ok(
        hash.reportData.get('reportEvents').findBy('profileId', 'profile3'),
        'Student that has not started is not found'
      );
      assert.ok(hash.collection, 'Collection is added to the model');
      assert.ok(hash.profiles, 'Profiles object is added to the model');
      assert.deepEqual(
        hash.collection,
        expectedCollection,
        'Collection should match'
      );
      assert.equal(hash.profiles, 'profiles', 'Profiles object should match');
      done();
    });
});

test('setupController', function(assert) {
  const route = this.subject();
  const controller = Ember.Object.create();
  const model = {
    reportData: ReportData.create({
      id: 'context-id',
      reportEvents: [
        ReportDataEvent.create({
          profileId: 'profile1'
        }),
        ReportDataEvent.create({
          profileId: 'profile2'
        })
      ]
    }),
    collection: Collection.create({
      id: 'collection-id'
    }),
    profiles: {
      profile1: Profile.create({
        id: 'profile1',
        firstName: 'first-name1',
        lastName: 'last-name1'
      }),
      profile2: Profile.create({
        id: 'profile2',
        firstName: 'first-name2',
        lastName: 'last-name2'
      })
    }
  };
  route.setupController(controller, model);
  assert.deepEqual(
    model.reportData.reportEvents[0].profileName,
    'first-name1 last-name1',
    'Profile 1 name should match'
  );
  assert.deepEqual(
    model.reportData.reportEvents[1].profileName,
    'first-name2 last-name2',
    'Profile 2 name should match'
  );
  assert.deepEqual(
    model.reportData.collection,
    model.collection,
    'Report data collection should be set'
  );
  assert.deepEqual(
    controller.reportData,
    model.reportData,
    'Report data should be set in the controller'
  );
});
