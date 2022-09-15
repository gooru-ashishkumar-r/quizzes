import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent('gru-math-text', 'Integration | Component | gru math text', {
  integration: true
});

test('Render math expression on katex', function(assert) {
  const text =
    '<span class=\'gru-math-expression\'><span class=\'gru-math-expression\'><span class=\'source\' hidden=\'\'>\\left\\{2324\\right\\}\\ \\times\\left|a\\right|</span>$$\\left\\{2324\\right\\}\\ \\times\\left|a\\right|$$</span></span><br>';

  this.set('text', text);

  this.render(hbs`{{gru-math-text text=text}}`);

  var $component = this.$(); //component dom element

  var $mathTextArea = $component.find('.gru-math-text');
  T.exists(assert, $mathTextArea, 'Missing math text area');
  T.exists(
    assert,
    $mathTextArea.find('.katex'),
    'Missing rendered math expression'
  );
});
