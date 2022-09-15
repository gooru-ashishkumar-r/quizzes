import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'gru-spinner-button',
  'Integration | Component | gru spinner button',
  {
    integration: true,
    beforeEach: function() {
      this.i18n = this.container.lookup('service:i18n');
      this.i18n.set('locale', 'en');
    }
  }
);

test('Layout', function(assert) {
  var text = this.get('i18n').t('common.loading').string;
  var classes = 'btn btn-warning remove';

  this.set('text', text);
  this.set('classes', classes);

  this.render(
    hbs`{{gru-spinner-button classes=classes text=text isLoading=true}}`
  );

  let $component = this.$(),
    $spinnerButton = $component.find('button.has-spinner');

  assert.ok($spinnerButton.length, 'Missing spinner button');
  assert.ok($spinnerButton.hasClass(classes), 'Missing classes');

  const $icon = $spinnerButton.find('.gru-icon.material-icons.cached');
  assert.ok($icon.length, 'Missing icon');
  const $text = $spinnerButton.find('.text');
  assert.equal($text.text().trim(), text, 'Wrong text');
});
