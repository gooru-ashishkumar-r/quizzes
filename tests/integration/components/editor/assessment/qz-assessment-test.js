import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'editor/assessment/qz-assessment',
  'Integration | Component | editor/assessment/qz assessment',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  this.render(hbs`{{editor/assessment/qz-assessment}}`);
  var $component = this.$();
  assert.ok(
    $component.find('.editor.assessment.qz-assessment').length,
    'Assessment component should appear'
  );
});
