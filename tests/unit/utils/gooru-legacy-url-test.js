import GooruLegacyUrl from 'quizzes-addon/utils/gooru-legacy-url';
import { module, test } from 'qunit';

module('Unit | Utility | gooru legacy url');

test('isCollectionPlayer', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#collection-play&id=120'
  });
  assert.ok(
    legacyUrl.get('isCollectionPlayer'),
    'Should be a collection player url'
  );
});

test('isAssessmentPlayer', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#assessment-play&id=120'
  });
  assert.ok(
    legacyUrl.get('isAssessmentPlayer'),
    'Should be a assessment player url'
  );
});

test('isResourcePlayer', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#resource-play&id=120'
  });
  assert.ok(
    legacyUrl.get('isResourcePlayer'),
    'Should be a resource player url'
  );
});

test('module', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#collection-play&id=120'
  });
  assert.equal(
    legacyUrl.get('module'),
    'collection-play',
    'Wrong module, it should be collection-player'
  );
});

test('id', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#collection-play&id=120'
  });
  assert.equal(legacyUrl.get('id'), '120', 'Wrong id, it should be 120');
});

test('contentId', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#collection-play&id=120&cid=1130'
  });
  assert.equal(
    legacyUrl.get('contentId'),
    '1130',
    'Wrong cid, it should be 1130'
  );
});

test('isLegacyUrl', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#collection-play&id=120&cid=1130'
  });
  assert.ok(legacyUrl.get('isLegacyUrl'), 'it should be a legacy url');
});

test('isLegacyUrl - not so', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: 'collection-play&id=120&cid=1130'
  });
  assert.ok(
    !legacyUrl.get('isLegacyUrl'),
    'it should not be a legacy url, missing #'
  );
});

test('isLegacyUrl - google sign url', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: 'access_token=1220304#'
  });
  assert.ok(
    !legacyUrl.get('isLegacyUrl'),
    'it should not be a legacy url, # is at the end'
  );
});

test('routeParams for collection-play with no content id', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#collection-play&id=120'
  });
  assert.deepEqual(
    legacyUrl.get('routeParams'),
    ['player', '120', { queryParams: { type: 'collection' } }],
    'Wrong params'
  );
});

test('routeParams for collection-play with content id', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#collection-play&id=120&cid=100'
  });
  assert.deepEqual(
    legacyUrl.get('routeParams'),
    [
      'player',
      '120',
      { queryParams: { resourceId: '100', type: 'collection' } }
    ],
    'Wrong params'
  );
});

test('routeParams for collection-play with invalid content id, cid={1}', function(
  assert
) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#collection-play&id=120&cid={1}'
  });
  assert.deepEqual(
    legacyUrl.get('routeParams'),
    ['player', '120', { queryParams: { type: 'collection' } }],
    'Wrong params'
  );
});

test('routeParams for assessment-play with no content id', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#assessment-play&id=120'
  });
  assert.deepEqual(
    legacyUrl.get('routeParams'),
    ['player', '120', { queryParams: { type: 'assessment' } }],
    'Wrong params'
  );
});

test('routeParams for assessment-play with content id', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#assessment-play&id=120&cid=100'
  });
  assert.deepEqual(
    legacyUrl.get('routeParams'),
    [
      'player',
      '120',
      { queryParams: { resourceId: '100', type: 'assessment' } }
    ],
    'Wrong params'
  );
});

test('routeParams for assessment-play with invalid content id, cid={1}', function(
  assert
) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#assessment-play&id=120&cid={1}'
  });
  assert.deepEqual(
    legacyUrl.get('routeParams'),
    ['player', '120', { queryParams: { type: 'assessment' } }],
    'Wrong params'
  );
});

test('routeParams for resource-play', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#resource-play&id=120'
  });
  assert.deepEqual(
    legacyUrl.get('routeParams'),
    ['content.resources.play', '120'],
    'Wrong params'
  );
});

test('routeParams for profile', function(assert) {
  const legacyUrl = GooruLegacyUrl.create({
    url: '#perezedify'
  });
  assert.deepEqual(
    legacyUrl.get('routeParams'),
    ['profile', 'perezedify'],
    'Wrong params'
  );
});
