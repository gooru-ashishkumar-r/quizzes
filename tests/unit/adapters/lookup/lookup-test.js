import { test } from 'ember-qunit';
import moduleForAdapter from 'dummy/tests/helpers/module-for-adapter';

moduleForAdapter(
  'adapter:lookup/lookup',
  'Unit | Adapter | lookup/lookup',
  {
    // needs: []
  }
);

test('readAudiences', function(assert) {
  assert.expect(1);

  const adapter = this.subject();
  const routes = function() {
    this.get(
      '/api/nucleus/v1/lookups/audience',
      function(/*request*/) {
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
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readAudiences().then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});

test('readLicenses', function(assert) {
  assert.expect(1);

  const adapter = this.subject();
  const routes = function() {
    this.get(
      '/api/nucleus/v1/lookups/licenses',
      function(/*request*/) {
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
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readLicenses().then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});

test('readDepthOfKnowledgeItems', function(assert) {
  assert.expect(1);

  const adapter = this.subject();
  const routes = function() {
    this.get(
      '/api/nucleus/v1/lookups/dok',
      function(/*request*/) {
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
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readDepthOfKnowledgeItems().then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});

test('readCountries', function(assert) {
  assert.expect(2);

  const adapter = this.subject();
  const keyword = 'any-keyword';
  const routes = function() {
    this.get(
      '/api/nucleus/v1/lookups/countries',
      function(request) {
        assert.equal(
          request.queryParams.keyword,
          'any-keyword',
          'Missing query param'
        );
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
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readCountries(keyword).then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});

test('readStates', function(assert) {
  assert.expect(2);

  const adapter = this.subject();
  const keyword = 'any-keyword';
  const routes = function() {
    this.get(
      '/api/nucleus/v1/lookups/countries/1/states',
      function(request) {
        assert.equal(
          request.queryParams.keyword,
          'any-keyword',
          'Missing query param'
        );
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
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readStates(1, keyword).then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});

test('readDistricts', function(assert) {
  assert.expect(3);

  const adapter = this.subject();
  const keyword = 'any-keyword';
  const routes = function() {
    this.get(
      '/api/nucleus/v1/lookups/school-districts',
      function(request) {
        assert.equal(
          request.queryParams.keyword,
          'any-keyword',
          'Missing keyword param'
        );
        assert.equal(request.queryParams.state_id, 1, 'Missing state param');
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
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter.readDistricts(1, keyword).then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});
