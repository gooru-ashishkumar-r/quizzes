import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('serializer:profile/profile', 'Unit | Serializer | profile/profile');

test('normalizeProfile', function(assert) {
  const serializer = this.subject({
    session: Ember.Object.create({
      cdnUrls: {
        user: 'cdn-test/'
      }
    })
  });
  const payload = {
    first_name: 'first-name',
    id: 'profile-id',
    last_name: 'last-name',
    username: 'username',
    email: 'e@mail.com',
    thumbnail: 'image',
    roster_global_userid: 'gcc001'
  };
  const response = serializer.normalizeProfile(payload);

  assert.deepEqual(response.get('id'), 'profile-id', 'Wrong profile id');
  assert.deepEqual(
    response.get('firstName'),
    'first-name',
    'Wrong profile first name'
  );
  assert.deepEqual(
    response.get('lastName'),
    'last-name',
    'Wrong profile last name'
  );
  assert.deepEqual(
    response.get('username'),
    'username',
    'Wrong profile username'
  );
  assert.deepEqual(response.get('email'), 'e@mail.com', 'Wrong profile email');
  assert.deepEqual(
    response.get('avatarUrl'),
    'cdn-test/image',
    'Wrong profile image'
  );
  assert.deepEqual(
    response.get('studentId'),
    'gcc001',
    'Wrong profile student id'
  );
});

test('normalizeProfiles', function(assert) {
  const serializer = this.subject({
    session: Ember.Object.create({
      cdnUrls: {
        user: 'cdn-test/'
      }
    })
  });

  const payload = {
    users: [
      {
        first_name: 'first-name',
        id: 'profile-id',
        last_name: 'last-name',
        username: 'username',
        email: 'e@mail.com',
        thumbnail: 'image',
        roster_global_userid: 'gcc001'
      }
    ]
  };
  const response = serializer.normalizeProfiles(payload);

  assert.deepEqual(
    response['profile-id'].get('id'),
    'profile-id',
    'Wrong profile id'
  );
  assert.deepEqual(
    response['profile-id'].get('firstName'),
    'first-name',
    'Wrong profile first name'
  );
  assert.deepEqual(
    response['profile-id'].get('lastName'),
    'last-name',
    'Wrong profile last name'
  );
  assert.deepEqual(
    response['profile-id'].get('username'),
    'username',
    'Wrong profile username'
  );
  assert.deepEqual(
    response['profile-id'].get('email'),
    'e@mail.com',
    'Wrong profile email'
  );
  assert.deepEqual(
    response['profile-id'].get('avatarUrl'),
    'cdn-test/image',
    'Wrong profile image'
  );
  assert.deepEqual(
    response['profile-id'].get('studentId'),
    'gcc001',
    'Wrong profile student id'
  );
});
