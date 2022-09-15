/**
 *Pie Chart
 *
 * Component responsible for showing the pie chart.
 *
 * @module
 * @augments ember/Component
 */
import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['charts', 'gru-pie-chart'],

  // -------------------------------------------------------------------------
  // Events

  didInsertElement: function() {
    const $component = this.$();

    // Get the component dimensions from the css
    this.setProperties({
      height: parseInt($component.css('height').split('px')[0]),
      width: parseInt($component.css('width').split('px')[0])
    });

    // Render the pie chart
    this.renderChart();
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number} width
   */
  width: null,

  /**
   * @property {Number} height
   */
  height: null,

  /**
   * @property {Number} radius - Radius of the pie chart
   */
  radius: Ember.computed('width', 'height', function() {
    return Math.min(this.get('width'), this.get('height')) / 2;
  }),

  /**
   * @property {D3.Object} color
   */
  colorScale: Ember.computed('colors', function() {
    return d3.scale.ordinal().range(this.get('colors'));
  }),

  /**
   * @property {Array} data
   * Data to graphic
   */
  values: Ember.computed('data', function() {
    return this.get('data').map(obj => {
      return { value: obj.value };
    });
  }),

  /**
   * @property {Array} colors
   * List of color to graphic
   */
  colors: Ember.computed('data', function() {
    return this.get('data').map(obj => obj.color);
  }),

  /**
   * @property {Array} data
   * Data to graphic
   */
  data: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Graphic a pie chart with d3 library
   */
  renderChart: Ember.observer('values', function() {
    const values = this.get('values');

    if (!this.validPercentages(values)) {
      Ember.Logger.warn('Graph values do not add up to 100');
    }

    const color = this.get('colorScale');

    // Remove a previous pie-chart, if there is one
    this.$('svg').remove();

    const radius = this.get('radius');
    const vis = d3
      .select(`#${this.elementId}`)
      .append('svg:svg')
      .data([values])
      .attr('width', this.get('width'))
      .attr('height', this.get('height'))
      .append('svg:g')
      .attr('transform', `translate(${radius},${radius})`);

    const pie = d3.layout.pie().value(d => d.value);

    //Declare an arc generator function
    const arc = d3.svg.arc().outerRadius(this.get('radius'));

    //Select paths, use arc generator to draw
    const arcs = vis
      .selectAll('g.slice')
      .data(pie)
      .enter()
      .append('svg:g')
      .attr('class', 'slice');
    arcs
      .append('svg:path')
      .attr('fill', (d, i) => color(i))
      .attr('d', d => arc(d));
  }),

  /**
   * Check if the values are up 100%
   */
  validPercentages: function(valuesArray) {
    const sum = valuesArray.reduce(
      (previousValue, value) => previousValue + parseInt(value.value),
      0
    );
    return sum === 100;
  }
});
