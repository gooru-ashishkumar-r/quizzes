import Ember from 'ember';
import Configuration from 'quizzes-addon/config/env/test';
import ConfigMixin from 'quizzes-addon/mixins/endpoint-config';
import { moduleFor, test } from 'ember-qunit';

moduleFor('mixin:endpoint-config', 'Unit | Mixin | endpoint-config', {
  beforeEach: function() {
    this.register(
      'service:quizzes/configuration',
      Ember.Object.extend({
        configuration: Ember.Object.create(Configuration)
      })
    );
    const ConfigObject = Ember.Object.extend(ConfigMixin);
    this.registry.register('test:subject', ConfigObject);
  }
});

test('getEndpointUrl', function(assert) {
  const subject = this.container.lookup('test:subject');
  const endpointUrl = subject.getEndpointUrl();
  assert.equal(endpointUrl, 'http://localhost:7357');
});

test('getEndpointSecureUrl', function(assert) {
  const subject = this.container.lookup('test:subject');
  const endpointUrl = subject.getEndpointSecureUrl();
  assert.equal(endpointUrl, 'http://localhost:7357');
});

test('getRealTimeWebServiceUrl', function(assert) {
  const subject = this.container.lookup('test:subject');
  const endpointUrl = subject.getRealTimeWebServiceUrl();
  assert.equal(endpointUrl, 'https://localhost:7357');
});

test('getRealTimeWebServiceUri', function(assert) {
  const subject = this.container.lookup('test:subject');
  const endpointUrl = subject.getRealTimeWebServiceUri();
  assert.equal(endpointUrl, '/nucleus/realtime');
});

test('getRealTimeWebSocketUrl', function(assert) {
  const subject = this.container.lookup('test:subject');
  const endpointUrl = subject.getRealTimeWebSocketUrl();
  assert.equal(endpointUrl, 'realtimeURL/realtimeURI');
});

test('getRealTimeWebSocketUri', function(assert) {
  const subject = this.container.lookup('test:subject');
  const endpointUrl = subject.getRealTimeWebSocketUri();
  assert.equal(endpointUrl, '/realtimeURI');
});
