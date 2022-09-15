import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'editor/assessment/qz-fixed-footer',
  'Integration | Component | editor/assessment/qz fixed footer',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  var actions = [
    {
      name: 'action1',
      text: 'action1-text',
      class: 'action1-class'
    },
    {
      name: 'action2',
      text: 'action2-text',
      class: 'action2-class'
    }
  ];

  this.set('footerActions', actions);

  this.render(
    hbs`{{editor/assessment/qz-fixed-footer footerActions=footerActions}}`
  );
  const $component = this.$();
  assert.ok(
    $component.find(`button.${actions[0].name}.${actions[0].class}`).length,
    'Missing first action'
  );
  assert.ok(
    $component.find(`button.${actions[1].name}.${actions[1].class}`).length,
    'Missing second action'
  );
});
