import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent(
  'gru-user-teaser',
  'Integration | Component | gru user teaser',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('User Tease Layout', function(assert) {
  const users = Ember.A([
    Ember.Object.create({
      email: 'user_1@test.com',
      firstName: 'firstname-1',
      fullName: 'lastname-1 firstname-1',
      id: 'id-1',
      lastName: 'lastname-1',
      avatarUrl: '/assets/quizzes-addon/profile.png',
      username: 'username-1'
    }),
    Ember.Object.create({
      email: 'user_2@test.com',
      firstName: 'firstname-2',
      fullName: 'lastname-2 firstname-2',
      id: 'id-2',
      lastName: 'lastname-2',
      avatarUrl: '/assets/quizzes-addon/profile.png',
      username: 'username-2'
    }),
    Ember.Object.create({
      email: 'user_1@test.com',
      firstName: 'firstname-3',
      fullName: 'lastname-3 firstname-3',
      id: 'id-1',
      lastName: 'lastname-3',
      avatarUrl: '/assets/quizzes-addon/profile.png',
      username: 'username-3'
    })
  ]);
  this.set('users', users);
  assert.expect(4);
  this.render(hbs`{{gru-user-teaser users=users}}`);

  var $component = this.$(); //component dom element
  const $userTeaser = $component.find('.gru-user-teaser');
  T.exists(assert, $userTeaser, 'Missing user teaser section');
  T.exists(
    assert,
    $userTeaser.find('img.avatar'),
    'Missing user profile picture'
  );
  T.exists(
    assert,
    $userTeaser.find('.user-full-name a'),
    'Missing first user fullname link'
  );
  T.exists(
    assert,
    $userTeaser.find('.total-users-left p'),
    'Missing total users left'
  );
});

test('User Tease with only 1 user', function(assert) {
  const users = Ember.A([
    Ember.Object.create({
      email: 'user_1@test.com',
      firstName: 'firstname-1',
      fullName: 'lastname-1 firstname-1',
      id: 'id-1',
      lastName: 'lastname-1',
      avatarUrl: '/assets/quizzes-addon/profile.png',
      username: 'username-1'
    })
  ]);
  this.set('users', users);
  assert.expect(1);
  this.render(hbs`{{gru-user-teaser users=users}}`);

  var $component = this.$(); //component dom element
  const $userTeaser = $component.find('.gru-user-teaser');

  T.notExists(
    assert,
    $userTeaser.find('.total-users-left p'),
    'Total users left should not appear'
  );
});
