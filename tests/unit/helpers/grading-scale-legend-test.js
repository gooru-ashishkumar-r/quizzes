import { gradingScaleLegend } from 'quizzes-addon/helpers/grading-scale-legend';
import { module, test } from 'qunit';
import { GRADING_SCALE } from 'quizzes-addon/config/quizzes-config';

module('Unit | Helper | grading scale legend');

test('it works without named arguments', function(assert) {
  const legend = gradingScaleLegend();
  const $legend = $(legend.string);

  assert.ok(
    $legend.hasClass('grading-scale-legend'),
    'has the correct container class'
  );
  assert.equal(
    $legend.find('li').length,
    GRADING_SCALE.length,
    'has the correct number of legend items'
  );
  assert.ok(
    $legend
      .find('li:first-child > i')
      .attr('style')
      .indexOf(GRADING_SCALE[0].COLOR) > 0,
    'starts with the lowest bracket in the grading scale'
  );
  assert.ok(
    $legend
      .find('li:last-child > i')
      .attr('style')
      .indexOf(GRADING_SCALE[GRADING_SCALE.length - 1].COLOR) > 0,
    'ends with the highest bracket in the grading scale'
  );
});

test('it works with the argument \'notStarted\'', function(assert) {
  const legend = gradingScaleLegend(null, { notStarted: 'not started string' });
  const $legend = $(legend.string);

  assert.ok(
    $legend.find('li.not-started').length,
    'shows an additional option \'not started\''
  );
  assert.equal(
    $legend.find('li.not-started').text().trim(),
    'not started string',
    'shows the correct text label for the option \'not started\''
  );
});
