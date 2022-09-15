import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'charts/gru-radial-chart',
  'Integration | Component | charts/gru-radial-chart',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Information Chart Layout', function(assert) {
  assert.expect(2);
  const minValue = 0;
  this.set('minValue', minValue);

  const maxValue = 50;
  this.set('maxValue', maxValue);

  const completePercent = 13;
  this.set('completePercent', completePercent);

  this.render(
    hbs`{{charts.gru-radial-chart minValue=minValue maxValue=maxValue completePercent=completePercent}}`
  );

  const $component = this.$(); //component dom element
  const $completionInformationChart = $component.find('.gru-radial-chart');

  T.exists(
    assert,
    $completionInformationChart,
    'Missing completion information chart component'
  );

  const $graph = $completionInformationChart.find('svg');

  T.exists(assert, $graph, 'Missing Chart');
});
