import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'qz-emotion-picker',
  'Integration | Component | qz emotion picker',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Emotion Picker', function(assert) {
  this.render(hbs`{{qz-emotion-picker}}`);

  const $component = this.$(); //component dom element
  const $emotionPicker = $component.find('.qz-emotion-picker');

  T.exists(assert, $emotionPicker, 'Missing emotion picker');

  const $emotions = $component.find('.emotion');
  assert.equal($emotions.length, 5, 'Incorrect number of emotions displayed');

  assert.ok($emotions.first().hasClass('emotion-5'));
  assert.ok($emotions.last().hasClass('emotion-1'));
});

test('Click emotion', function(assert) {
  assert.expect(1);

  this.on('parentAction', function(emotion) {
    assert.equal('5', emotion);
  });

  this.render(hbs`{{qz-emotion-picker onChangeEmotion='parentAction'}}`);
  var $component = this.$(); //component dom element
  var $emotionPicker = $component.find('div.emotion-picker');
  $emotionPicker.find('.emotions-list li:first-child .emotion').click();
});

test('Verify selected emotion', function(assert) {
  assert.expect(1);

  this.set('emotionValue', 3);

  this.render(hbs`{{qz-emotion-picker startEmotion=emotionValue}}`);
  var $component = this.$(); //component dom element
  var $emotionPicker = $component.find('div.emotion-picker');
  var $selectedEmotion = $emotionPicker.find(
    '.emotions-list li:eq(2) .emotion'
  );
  assert.ok($selectedEmotion.hasClass('active'));
});

test('Click emotion in readOnly', function(assert) {
  assert.expect(0);

  this.on('parentAction', function(emotion) {
    assert.ok(false, `This should not be called: ${emotion}`);
  });

  this.render(
    hbs`{{qz-emotion-picker onChangeEmotion='parentAction' readOnly=true}}`
  );
  var $component = this.$(); //component dom element
  var $emotionPicker = $component.find('div.emotion-picker');
  $emotionPicker.find('.emotions-list li:first-child .emotion').click();
});
