import { skip } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import T from 'dummy/tests/helpers/assert';

moduleForAcceptance('Acceptance | player');

skip('Layout', function(assert) {
  assert.expect(1);
  visit('/player/context-simple-id');
  andThen(function() {
    const $playerContainer = find('.component.player');
    T.exists(assert, $playerContainer, 'Missing player');
  });
});
