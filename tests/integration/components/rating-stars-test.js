import { moduleForComponent, test } from 'ember-qunit';
import T from 'dummy/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('rating-stars', 'Integration | Component | rating stars', {
  integration: true,
  beforeEach: function() {
    this.container.lookup('service:i18n').set('locale', 'en');
  }
});

test('rating-stars-default', function(assert) {
  assert.expect(3);

  this.render(hbs`{{rating-stars rating=5}}`); //render the component
  var $component = this.$(); //component dom element
  const $ratingStars = $component.find('.rating-stars');
  T.exists(assert, $ratingStars, 'Missing rating stars section');

  const $stars = $component.find('.star');
  assert.equal($stars.length, 5, 'Incorrect number of stars');

  const $numberStars = $component.find('.number-stars-label');
  T.exists(assert, $numberStars, 'Missing rating stars section');
});
test('rating-stars-selected', function(assert) {
  assert.expect(4);

  this.render(hbs`{{rating-stars rating=1}}`); //render the component
  var $component = this.$(); //component dom element
  const $ratingStars = $component.find('.rating-stars');
  T.exists(assert, $ratingStars, 'Missing rating stars section');

  const $starsFull = $component.find('.fa-star');
  assert.equal($starsFull.length, 1, 'Incorrect number of full stars');

  const $starsEmpty = $component.find('.fa-star-o');
  assert.equal($starsEmpty.length, 4, 'Incorrect number of empty stars');

  const $numberStarsLabel = $component.find('.number-stars-label p');
  assert.equal(T.text($numberStarsLabel), '1+ Stars', 'Incorrect label text');
});
test('rating-stars-small', function(assert) {
  assert.expect(4);

  this.render(
    hbs`{{rating-stars rating=5 rating-star-size='rating-stars-xs' isClickable=false}}`
  ); //render the component
  var $component = this.$(); //component dom element
  const $ratingStars = $component.find('.rating-stars');
  T.exists(assert, $ratingStars, 'Missing rating stars section');

  const $starsFull = $component.find('.fa-star');
  assert.equal($starsFull.length, 5, 'Incorrect number of full stars');

  const $starsEmpty = $component.find('.rating-stars-xs');
  assert.equal($starsEmpty.length, 5, 'Incorrect number of small stars');

  const $numberStarsLabel = $component.find('.number-stars-label p');
  assert.equal(
    $numberStarsLabel.length,
    0,
    'The number stars label should not appear'
  );
});
