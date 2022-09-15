import Ember from 'ember';
import Pretender from 'pretender';
import { moduleFor, test } from 'ember-qunit';
import Configuration from 'quizzes-addon/config/env/test';

moduleFor('adapter:resource/resource', 'Unit | Adapter | resource/resource', {
  beforeEach: function() {
    this.pretender = new Pretender();
  },
  afterEach: function() {
    this.pretender.shutdown();
  }
});

test('sendFinishResource', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });

  const routes = function() {
    this.post(
      '/quizzes/api/v1/resources/resource-id/finish',
      request => {
        const requestBodyJson = JSON.parse(request.requestBody);
        assert.equal(
          requestBodyJson.resourceEventData,
          'event-data',
          'Wrong resource event data'
        );
        assert.equal(
          requestBodyJson.eventContext,
          'event-context',
          'Wrong event context'
        );
        return [200, { 'Content-Type': 'application/json' }, '{}'];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  const done = assert.async();
  adapter
    .sendFinishResource('resource-id', 'event-data', 'event-context')
    .then(done);
});

test('readResource', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });

  const routes = function() {
    this.get(
      '/api/nucleus/v1/resources/resource-id',
      () => [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
          id: 'resource-id'
        })
      ],
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  adapter
    .readResource('resource-id')
    .then(response =>
      assert.deepEqual(response.id, 'resource-id', 'Wrong response')
    );
});
