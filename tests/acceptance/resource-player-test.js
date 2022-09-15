import { test } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import T from 'dummy/tests/helpers/assert';

moduleForAcceptance('Acceptance | resource-player');

test('Layout', function(assert) {
  assert.expect(3);
  visit('/resource-player/resource-id');

  andThen(function() {
    assert.equal(currentURL(), '/resource-player/resource-id');
    const $playerContainer = find('.resource-player');
    T.exists(assert, $playerContainer, 'Missing player');
    T.exists(
      assert,
      $playerContainer.find('.qz-resource-viewer'),
      'Missing resource viewer'
    );
  });
});
