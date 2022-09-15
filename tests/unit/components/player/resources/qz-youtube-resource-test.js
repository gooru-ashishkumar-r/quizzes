import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'player/resources/qz-youtube-resource',
  'Unit | Component | player/resources/ qz youtube resource',
  {
    integration: false
  }
);

test('getYoutubeIdFromUrl', function(assert) {
  assert.expect(2);

  var component = this.subject();

  var id = component.getYoutubeIdFromUrl(
    'https://www.youtube.com/watch?v=3HMjvnCjc24&list=PL7302FBCD1366292D'
  );
  assert.equal(id, '3HMjvnCjc24', 'Incorrect ID');

  id = component.getYoutubeIdFromUrl(
    'https://www.youtube.com/watch?v=1_43zbexW7w'
  );
  assert.equal(id, '1_43zbexW7w', 'Incorrect ID');

  /*
    The regexp used to get the id support several urls,
    the idea is to add more cases in here as they appear
   */
});
