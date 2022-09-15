import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent(
  'charts/gru-x-bar-chart',
  'Integration | Component | charts/gru x bar chart',
  {
    integration: true
  }
);

test('Stacked horizontal bar chart layout', function(assert) {
  assert.expect(3);

  var data = Ember.A([
    Ember.Object.create({
      color: '#00e100',
      percentage: '20'
    }),
    Ember.Object.create({
      color: '#ff5a5a',
      percentage: '35'
    })
  ]);

  this.set('data', data);
  this.render(hbs`{{charts/gru-x-bar-chart data=data}}`);
  const $component = this.$(); //component dom element
  const $horizontalBarChart = $component.find('.gru-x-bar-chart');

  T.exists(
    assert,
    $horizontalBarChart,
    'Missing stacked horizontal bar chart component'
  );
  assert.equal(
    $horizontalBarChart.find('.segment:nth-child(1)').attr('style'),
    `background-color: ${data[0].color}; width: ${data[0].percentage}%;`,
    'Incorrect width and color for the first segment'
  );
  assert.equal(
    $horizontalBarChart.find('.segment:nth-child(2)').attr('style'),
    `background-color: ${data[1].color}; width: ${data[1].percentage}%;`,
    'Incorrect width and color for the second segment'
  );
});

test('Full bar segment layout', function(assert) {
  assert.expect(2);

  var data = Ember.A([
    Ember.Object.create({
      color: '#00e100',
      percentage: '80'
    }),
    Ember.Object.create({
      color: '#ff5a5a',
      percentage: '20'
    })
  ]);

  this.set('data', data);
  this.render(hbs`{{charts/gru-x-bar-chart data=data}}`);
  const $component = this.$(); //component dom element
  const $segmentBar = $component.find('.gru-x-bar-chart .segment');

  T.exists(assert, $segmentBar, 'Missing segment bar');
  assert.ok($segmentBar.hasClass('full'), 'Missing full class');
});
