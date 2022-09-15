import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { GRADING_SCALE } from 'quizzes-addon/config/quizzes-config';

moduleForComponent(
  'reports/class-assessment/qz-questions-summary',
  'Integration | Component | reports/class assessment/qz questions summary',
  {
    integration: true
  }
);

test('it renders all questions', function(assert) {
  const questionsData = [
    {
      id: 1,
      correct: 3,
      incorrect: 4,
      total: 12
    },
    {
      id: 2,
      correct: 6,
      incorrect: 2,
      total: 12
    },
    {
      id: 3,
      correct: 4,
      incorrect: 5,
      total: 12
    }
  ];

  this.set('questionsData', questionsData);

  this.render(
    hbs`{{reports/class-assessment/qz-questions-summary data=questionsData}}`
  );

  const $component = this.$('.reports.class-assessment.qz-questions-summary');
  assert.ok($component.length, 'Component has component classes');
  assert.equal(
    $component.find('ol li').length,
    3,
    'Component shows all questions'
  );
  assert.ok(
    !$component.find('> a').length,
    'Button to view more questions is not visible'
  );
});

test('it renders the question charts correctly', function(assert) {
  const questionsData = [
    {
      id: 1,
      correct: 5,
      incorrect: 5,
      openEnded: 0,
      total: 10
    },
    {
      id: 2,
      correct: 6,
      incorrect: 3,
      openEnded: 0,
      total: 10
    }
  ];

  this.set('questionsData', questionsData);

  this.render(
    hbs`{{reports/class-assessment/qz-questions-summary data=questionsData}}`
  );

  const $component = this.$('.reports.class-assessment.qz-questions-summary');

  const $lastItem = $component.find('li:last');
  assert.equal(
    $lastItem.find('.index').text(),
    '2',
    'Last item has the right index number'
  );

  const $incorrectBar = $lastItem.find('.gru-x-bar-chart .segment:first');
  assert.ok(
    $incorrectBar
      .attr('style')
      .split(';')[0]
      .indexOf(GRADING_SCALE[0].COLOR) > 0,
    'The incorrect segment in the chart has the fail color per the grading scale'
  );
  assert.ok(
    $incorrectBar
      .attr('style')
      .split(';')[1]
      .indexOf('30%') > 0,
    'The incorrect segment in the chart shows the right percentage'
  );

  const $correctBar = $lastItem.find('.gru-x-bar-chart .segment:nth-child(2)');
  assert.ok(
    $correctBar
      .attr('style')
      .split(';')[0]
      .indexOf(GRADING_SCALE[GRADING_SCALE.length - 1].COLOR) > 0,
    'The correct segment in the chart has the correct color per the grading scale'
  );
  assert.ok(
    $correctBar
      .attr('style')
      .split(';')[1]
      .indexOf('60%') > 0,
    'The correct segment in the chart shows the right percentage'
  );

  const $ratio = $lastItem.find('.ratio');
  assert.equal(
    $ratio.find('span:first').text(),
    '9',
    'Wrong number of students that have completed the question'
  );
  assert.equal(
    $ratio.find('span:last').text(),
    '10',
    'Wrong number of total students'
  );
});

test('it renders some of the questions and a \'view more\' button if the container is not wide enough to show all questions', function(
  assert
) {
  assert.expect(4);

  const questionsData = [
    {
      id: 1,
      correct: 3,
      incorrect: 4,
      total: 12
    },
    {
      id: 2,
      correct: 6,
      incorrect: 2,
      total: 12
    },
    {
      id: 3,
      correct: 4,
      incorrect: 5,
      total: 12
    }
  ];

  this.set('questionsData', questionsData);

  // The minimum width of the items will be that of the container which means that
  // only one column will be shown
  this.set(
    'itemMinWidth',
    $('#ember-testing')
      .css('width')
      .split('px')[0]
  );

  // Show 2 items per column
  this.set('numItems', 2);

  this.on('externalAction', function() {
    assert.ok(
      true,
      'Component calls an external action when the view more button is clicked'
    );
  });

  this.render(hbs`{{reports/class-assessment/qz-questions-summary
    data=questionsData
    itemsPerColumn=numItems
    itemMinWidth=itemMinWidth
    onToggleView=(action 'externalAction') }}`);

  const $component = this.$('.reports.class-assessment.qz-questions-summary');
  assert.equal(
    $component.find('ol li').length,
    2,
    'Component shows the correct number of items'
  );

  const $viewMoreButton = $component.find('> a.show-more i');
  assert.ok($viewMoreButton.length, 'Button to view more questions is visible');
  assert.ok(
    $viewMoreButton.hasClass('keyboard_arrow_right'),
    'Button should indicate that more questions can be viewed'
  );

  $viewMoreButton.click();
});

test('it can be forced to show all questions even if the container is not wide enough to show all of them', function(
  assert
) {
  const questionsData = [
    {
      id: 1,
      correct: 3,
      incorrect: 4,
      total: 12
    },
    {
      id: 2,
      correct: 6,
      incorrect: 2,
      total: 12
    },
    {
      id: 3,
      correct: 4,
      incorrect: 5,
      total: 12
    }
  ];

  this.set('questionsData', questionsData);

  // The minimum width of the items will be that of the container which means that
  // only one column will be shown
  this.set(
    'itemMinWidth',
    $('#ember-testing')
      .css('width')
      .split('px')[0]
  );

  // Show 2 items per column
  this.set('numItems', 2);

  // Control whether all questions should be visible or not
  this.set('viewAllQuestions', false);

  this.render(hbs`{{reports/class-assessment/qz-questions-summary
    data=questionsData
    itemsPerColumn=numItems
    itemMinWidth=itemMinWidth
    isExpanded=viewAllQuestions }}`);

  const $component = this.$('.reports.class-assessment.qz-questions-summary');
  assert.equal(
    $component.find('ol li').length,
    2,
    'Component shows the correct number of items'
  );

  const $viewMoreButton = $component.find('> a.show-more i');
  assert.ok($viewMoreButton.length, 'Button to view more questions is visible');
  assert.ok(
    $viewMoreButton.hasClass('keyboard_arrow_right'),
    'Button should indicate that more questions can be viewed'
  );

  this.set('viewAllQuestions', true);
  assert.equal(
    $component.find('ol li').length,
    3,
    'Component shows all the items'
  );
  assert.ok(
    $viewMoreButton.hasClass('keyboard_arrow_left'),
    'Button should indicate that less questions can be viewed'
  );

  // Setting the variable back to false should restore back to the original state
  this.set('viewAllQuestions', false);
  assert.equal(
    $component.find('ol li').length,
    2,
    'Component correctly reduces the number of items visible'
  );
  assert.ok(
    $viewMoreButton.hasClass('keyboard_arrow_right'),
    'Button should indicate again that more questions can be viewed'
  );
});

test('it calls an external action when any of the questions is clicked', function(
  assert
) {
  assert.expect(2);

  let numClicks = 1;
  const questionsData = [
    {
      id: 1,
      correct: 3,
      incorrect: 4,
      total: 12
    },
    {
      id: 2,
      correct: 6,
      incorrect: 2,
      total: 12
    },
    {
      id: 3,
      correct: 4,
      incorrect: 5,
      total: 12
    }
  ];

  this.set('questionsData', questionsData);

  this.on('externalAction', function(itemId) {
    if (numClicks === 1) {
      assert.equal(itemId, '3', 'First click: correct item id is sent');
      numClicks += 1;
    } else {
      assert.equal(itemId, '1', 'Second click: correct item id is sent');
    }
  });

  this.render(hbs`{{reports/class-assessment/qz-questions-summary
    data=questionsData
    onSelectQuestion=(action 'externalAction') }}`);

  const $component = this.$('.reports.class-assessment.qz-questions-summary');
  $component.find('li:last > a').click();
  $component.find('li:first > a').click();
});
