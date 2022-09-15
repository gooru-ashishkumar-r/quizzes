import Ember from 'ember';
import Pretender from 'pretender';
import { moduleFor, test } from 'ember-qunit';
import Configuration from 'quizzes-addon/config/env/test';

moduleFor('adapter:attempt/attempt', 'Unit | Adapter | attempt/attempt', {
  beforeEach: function() {
    this.pretender = new Pretender();
  },
  afterEach: function() {
    this.pretender.shutdown();
  }
});

test('getReportData', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedContextId = 'context-id';
  const routes = function() {
    this.get(
      '/quizzes/api/v1/attempts/contexts/context-id',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter
    .getReportData(expectedContextId)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
});

test('getAttemptData', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedAttemptId = 'attempt-id';
  const routes = function() {
    this.get(
      '/quizzes/api/v1/attempts/attempt-id',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter
    .getAttemptData(expectedAttemptId)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
});

test('getAttemptIds', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedContextId = 'context-id';
  const expectedProfileId = 'profile-id';
  const routes = function() {
    this.get(
      '/quizzes/api/v1/attempts/contexts/context-id/profiles/profile-id',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter
    .getAttemptIds(expectedContextId, expectedProfileId)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
});
