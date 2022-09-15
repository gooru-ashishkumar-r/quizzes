import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';

moduleForService(
  'service:quizzes/api-sdk/lookup',
  'Unit | Service | quizzes/api-sdk/lookup',
  {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  }
);

test('readAudiences', function(assert) {
  const service = this.subject();
  assert.expect(2);

  service.set(
    'lookupAdapter',
    Ember.Object.create({
      readAudiences: function() {
        assert.ok(true, 'readAudiences(1) function was called');
        return Ember.RSVP.resolve({});
      }
    })
  );

  service.set(
    'lookupSerializer',
    Ember.Object.create({
      normalizeReadAudiences: function(response) {
        assert.deepEqual(
          response,
          {},
          'normalizeReadAudiences() function was called'
        );
        return [];
      }
    })
  );

  var done = assert.async();
  service.readAudiences().then(function() {
    done();
  });
});

test('readLicenses', function(assert) {
  const service = this.subject();
  assert.expect(2);

  service.set(
    'lookupAdapter',
    Ember.Object.create({
      readLicenses: function() {
        assert.ok(true, 'readLicenses(1) function was called');
        return Ember.RSVP.resolve({});
      }
    })
  );

  service.set(
    'lookupSerializer',
    Ember.Object.create({
      normalizeReadLicenses: function(response) {
        assert.deepEqual(
          response,
          {},
          'normalizeReadLicenses() function was called'
        );
        return [];
      }
    })
  );

  var done = assert.async();
  service.readLicenses().then(function() {
    done();
  });
});

test('readDepthOfKnowledgeItems', function(assert) {
  const service = this.subject();
  assert.expect(2);

  service.set(
    'lookupAdapter',
    Ember.Object.create({
      readDepthOfKnowledgeItems: function() {
        assert.ok(true, 'readDepthOfKnowledgeItems(1) function was called');
        return Ember.RSVP.resolve({});
      }
    })
  );

  service.set(
    'lookupSerializer',
    Ember.Object.create({
      normalizeReadDepthOfKnowledgeItems: function(response) {
        assert.deepEqual(
          response,
          {},
          'normalizeReadDepthOfKnowledgeItems() function was called'
        );
        return [];
      }
    })
  );

  var done = assert.async();
  service.readDepthOfKnowledgeItems().then(function() {
    done();
  });
});

test('readCountries', function(assert) {
  const service = this.subject();
  assert.expect(2);

  service.set(
    'lookupAdapter',
    Ember.Object.create({
      readCountries: function(keyworkd) {
        assert.equal(keyworkd, 'any', 'readCountries(1) function was called');
        return Ember.RSVP.resolve({});
      }
    })
  );

  service.set(
    'lookupSerializer',
    Ember.Object.create({
      normalizeReadCountries: function(response) {
        assert.deepEqual(
          response,
          {},
          'normalizeReadCountries() function was called'
        );
        return [];
      }
    })
  );

  var done = assert.async();
  service.readCountries('any').then(function() {
    done();
  });
});

test('readStates', function(assert) {
  const service = this.subject();
  assert.expect(3);

  service.set(
    'lookupAdapter',
    Ember.Object.create({
      readStates: function(countryId, keyword) {
        assert.equal(countryId, 1, 'Wrong country id');
        assert.equal(keyword, 'any', 'Wrong keyword');
        return Ember.RSVP.resolve({});
      }
    })
  );

  service.set(
    'lookupSerializer',
    Ember.Object.create({
      normalizeReadStates: function(response) {
        assert.deepEqual(
          response,
          {},
          'normalizeReadStates() function was called'
        );
        return [];
      }
    })
  );

  var done = assert.async();
  service.readStates(1, 'any').then(function() {
    done();
  });
});

test('readDistricts', function(assert) {
  const service = this.subject();
  assert.expect(3);

  service.set(
    'lookupAdapter',
    Ember.Object.create({
      readDistricts: function(stateId, keyword) {
        assert.equal(stateId, 1, 'Wrong state id');
        assert.equal(keyword, 'any', 'Wrong keyword');
        return Ember.RSVP.resolve({});
      }
    })
  );

  service.set(
    'lookupSerializer',
    Ember.Object.create({
      normalizeReadDistricts: function(response) {
        assert.deepEqual(
          response,
          {},
          'normalizeReadDistricts() function was called'
        );
        return [];
      }
    })
  );

  var done = assert.async();
  service.readDistricts(1, 'any').then(function() {
    done();
  });
});
