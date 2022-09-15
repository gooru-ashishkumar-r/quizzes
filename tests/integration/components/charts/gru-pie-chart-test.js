import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'charts/gru-pie-chart',
  'Integration | Component | charts/gru pie chart',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Pie Chart Layout', function(assert) {
  const pieData = [
    {
      color: '#00e100',
      value: '20'
    },
    {
      color: '#ff5a5a',
      value: '35'
    },
    {
      color: '#885aff',
      value: '20'
    },
    {
      color: '#ff860a',
      value: '30'
    }
  ];

  this.set('pieData', pieData);

  this.render(hbs`{{charts/gru-pie-chart data=pieData}}`);

  const $component = this.$('.charts.gru-pie-chart');

  assert.ok($component.length, 'Component missing component classes');
});
