import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';

moduleForService(
  'service:quizzes/api-sdk/attempt',
  'Unit | Service | quizzes/api-sdk/attempt'
);

test('getReportData', function(assert) {
  assert.expect(3);
  const service = this.subject();
  const expectedContextId = 'context-id';
  const contextResult = {
    id: 'result-id'
  };

  service.set(
    'attemptAdapter',
    Ember.Object.create({
      getReportData: function(contextId) {
        assert.deepEqual(
          contextId,
          expectedContextId,
          'The context id should match'
        );
        return Ember.RSVP.resolve(contextResult);
      }
    })
  );

  service.set(
    'attemptSerializer',
    Ember.Object.create({
      normalizeReportData: function(response) {
        assert.deepEqual(
          response,
          contextResult,
          'The context result should match'
        );
        return contextResult;
      }
    })
  );

  const done = assert.async();
  service.getReportData(expectedContextId).then(result => {
    assert.deepEqual(result, contextResult, 'The result should match');
    done();
  });
});

test('getAttemptData', function(assert) {
  assert.expect(3);
  const service = this.subject();
  const expectedAttemptId = 'attempt-id';
  const attemptData = { id: 'result-id' };

  service.set(
    'attemptAdapter',
    Ember.Object.create({
      getAttemptData: function(attemptId) {
        assert.deepEqual(
          attemptId,
          expectedAttemptId,
          'The attempt id should match'
        );
        return Ember.RSVP.resolve(attemptData);
      }
    })
  );

  service.set(
    'attemptSerializer',
    Ember.Object.create({
      normalizeReportDataEvent: function(response) {
        assert.deepEqual(
          response,
          attemptData,
          'The attempt data should match'
        );
        return attemptData;
      }
    })
  );

  const done = assert.async();
  service.getAttemptData(expectedAttemptId).then(result => {
    assert.deepEqual(result, attemptData, 'The result should match');
    done();
  });
});

test('getAttemptIds', function(assert) {
  assert.expect(4);
  const service = this.subject();
  const expectedContextId = 'context-id';
  const expectedProfileId = 'profile-id';
  const attemptData = { attempts: ['results'] };

  service.set(
    'attemptAdapter',
    Ember.Object.create({
      getAttemptIds: function(contextId, profileId) {
        assert.deepEqual(
          contextId,
          expectedContextId,
          'The context id should match'
        );
        assert.deepEqual(
          profileId,
          expectedProfileId,
          'The profile id should match'
        );
        return Ember.RSVP.resolve(attemptData);
      }
    })
  );

  service.set(
    'attemptSerializer',
    Ember.Object.create({
      normalizeAttemptIds: function(response) {
        assert.deepEqual(
          response,
          attemptData,
          'The attempt data should match'
        );
        return attemptData;
      }
    })
  );

  const done = assert.async();
  service.getAttemptIds(expectedContextId, expectedProfileId).then(result => {
    assert.deepEqual(result, attemptData, 'The result should match');
    done();
  });
});
