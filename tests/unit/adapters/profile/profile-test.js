import Ember from 'ember';
import Pretender from 'pretender';
import { moduleFor, test } from 'ember-qunit';
import Configuration from 'quizzes-addon/config/env/test';

moduleFor('adapter:profile/profile', 'Unit | Adapter | profile/profile', {
  beforeEach: function() {
    this.pretender = new Pretender();
  },
  afterEach: function() {
    this.pretender.shutdown();
  }
});

test('readProfile', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });

  const routes = function() {
    this.get(
      '/api/nucleus/v2/profiles/search',
      () => [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
          users: [
            {
              id: '77d0c04b-b71a-485b-9573-9101cc288a0f'
            }
          ]
        })
      ],
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  adapter
    .readProfiles(['profile-id'])
    .then(response =>
      assert.deepEqual(
        response.users[0].id,
        '77d0c04b-b71a-485b-9573-9101cc288a0f',
        'Wrong response'
      )
    );
});
