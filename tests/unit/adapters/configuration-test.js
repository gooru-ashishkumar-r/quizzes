import { test } from 'ember-qunit';
import moduleForAdapter from 'dummy/tests/helpers/module-for-adapter';

moduleForAdapter(
  'adapter:configuration',
  'Unit | Adapter | configuration',
  {
    // needs: []
  }
);

test('loadConfiguration', function(assert) {
  assert.expect(1);

  const adapter = this.subject();
  const routes = function() {
    this.get(
      'config/any-environment.json',
      function(/*request*/) {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({ a: 1 })
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  const done = assert.async();
  adapter.loadConfiguration('any-environment').then(function(response) {
    assert.deepEqual({ a: 1 }, response, 'Wrong response');
    done();
  });
});
