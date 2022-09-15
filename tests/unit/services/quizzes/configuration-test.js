import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';

moduleForService(
  'service:quizzes/configuration',
  'Unit | Service | quizzes/configuration',
  {
    // Specify the other units that are required for this test.
    needs: ['config:environment']
  }
);

test('loadConfiguration', function(assert) {
  const service = this.subject();
  assert.expect(3);

  service.set(
    'configurationAdapter',
    Ember.Object.create({
      loadConfiguration: function(key) {
        assert.equal(
          key,
          'localhost-quizzes',
          'loadConfiguration function was called'
        );
        return Ember.RSVP.resolve({
          teams: {
            url: 'any'
          }
        });
      }
    })
  );

  var done = assert.async();
  service.loadConfiguration().then(function(configuration) {
    assert.equal(
      configuration.get('endpoint.url'),
      'http://localhost:7357',
      'endpoints.url should match config/env/test.js value'
    );
    assert.equal(
      configuration.get('teams.url'),
      'any',
      'teams.url was not overridden'
    );
    done();
  });
});

test('setToken', function(assert) {
  const service = this.subject({
    configuration: {
      properties: {}
    }
  });

  service.setToken('abc');
  assert.equal(service.get('configuration.properties.token'), 'abc');
});
