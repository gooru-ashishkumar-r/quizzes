import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent('gru-bubbles', 'Integration | Component | gru bubbles', {
  integration: true,
  beforeEach: function() {
    this.container.lookup('service:i18n').set('locale', 'en');
  }
});

test('Bubbles Layout', function(assert) {
  assert.expect(4);
  const bubbleOptions = Ember.A([
    Ember.Object.create({
      label: '1',
      status: 'correct',
      value: 'some-value-1',
      selected: true
    }),
    Ember.Object.create({
      label: '2',
      status: 'incorrect',
      value: 'some-value-2'
    }),
    Ember.Object.create({
      label: '3',
      status: 'incorrect',
      value: 'some-value-3'
    })
  ]);

  this.set('bubbleOptions', bubbleOptions);
  this.render(hbs`{{gru-bubbles bubbleOptions=bubbleOptions}}`);

  const $component = this.$(); //component dom element
  const $bubbles = $component.find('.gru-bubbles');

  T.exists(assert, $bubbles, 'Missing bubbles component');
  T.exists(
    assert,
    $bubbles.find('.bubble.selected'),
    'Missing selected bubble'
  );
  T.exists(assert, $bubbles.find('.bubble.correct'), 'Missing correct bubble');
  assert.equal(
    $bubbles.find('.bubble.incorrect').length,
    2,
    'Incorrect number of incorrect bubbles'
  );
});
test('Select bubble', function(assert) {
  assert.expect(4);

  this.on('parentAction', function(option) {
    assert.equal(1, option.label, 'Wrong label');
    assert.ok(option.selected, 'Option should be selected');
  });

  const bubbleOptions = Ember.A([
    Ember.Object.create({
      label: '1',
      status: 'correct',
      value: 'some-value-1'
    }),
    Ember.Object.create({
      label: '2',
      status: 'incorrect',
      value: 'some-value-2'
    }),
    Ember.Object.create({
      label: '3',
      status: 'incorrect',
      value: 'some-value-3'
    })
  ]);

  this.set('bubbleOptions', bubbleOptions);
  this.render(
    hbs`{{gru-bubbles bubbleOptions=bubbleOptions onBubbleSelect='parentAction'}}`
  );
  var $component = this.$(); //component dom element
  var $bubbles = $component.find('.bubbles-list');
  T.notExists(
    assert,
    $bubbles.find('.bubble.selected'),
    'No bubbles should be selected'
  );
  $bubbles.find('li:first-child a').click();
  T.exists(
    assert,
    $bubbles.find('.bubble.selected'),
    'Missing selected bubble'
  );
});
