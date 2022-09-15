import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Collection from 'quizzes-addon/models/collection/collection';
import QuestionResult from 'quizzes-addon/models/result/question';
import ContextResult from 'quizzes-addon/models/result/context';

moduleForComponent(
  'reports/assessment/qz-summary',
  'Integration | Component | reports/assessment/qz summary',
  {
    integration: true,

    beforeEach: function() {
      this.inject.service('i18n');
    }
  }
);

test('it renders for assessment', function(assert) {
  const date = new Date(2010, 1, 20);
  date.setSeconds(10);
  date.setMinutes(15);
  date.setHours(11);

  const contextResult = ContextResult.create({
    id: 501,
    resourceResults: [
      QuestionResult.create({
        id: 601,
        resource: {
          sequence: 1
        },
        score: 0,
        savedTime: 20000,
        reaction: 2
      }),
      QuestionResult.create({
        id: 603,
        resource: {
          sequence: 3
        },
        score: 100,
        savedTime: 20000,
        reaction: 2
      }),
      QuestionResult.create({
        id: 602,
        resource: {
          sequence: 2
        },
        score: 100,
        savedTime: 20000,
        reaction: 2
      })
    ],
    submittedAt: date,
    averageReaction: 2,
    totalTimeSpent: 60000,
    correctAnswers: 2,
    correctPercentage: 67,
    totalAttempts: 4
  });

  const collection = Collection.create({
    isCollection: false,
    resources: [],
    title: 'collection'
  });

  contextResult.merge(collection);
  this.set('contextResult', contextResult);
  this.set('areQuestionLinksHidden', false);

  this.render(hbs`
    {{reports/assessment/qz-summary
      contextResult=contextResult
      areQuestionLinksHidden=areQuestionLinksHidden
    }}`);

  const $component = this.$('.reports.assessment.qz-summary'); //component dom element
  assert.ok($component.length, 'Component does not have the component classes');

  const $gradeContainer = $component.find(
    '.summary-container .grade[style~=\'background-color:\']'
  );

  const $attempts = $gradeContainer.find('.attempts');
  assert.ok(
    $attempts.find('.attempt-selector'),
    'Attempts dropdown should be visible'
  );
  assert.notOk(
    $attempts.find('.current').length,
    'Current attempt label should not be visible'
  );
  assert.notOk(
    $attempts.find('.latest').length,
    'Latest attempt label should not be visible'
  );
  const $fractional = $attempts.find('.fractional');
  assert.ok($fractional, 'Fractional not found');

  const $overviewContainer = $component.find('.summary-container .overview');
  const $reactionContainer = $component.find('.summary-container .reactions');

  assert.ok($overviewContainer.length, 'Overview container is missing');
  assert.ok($overviewContainer.find('h5').length, 'Header element is missing');
  assert.equal(
    $overviewContainer
      .find('h5')
      .text()
      .trim(),
    'collection',
    'Incorrect header text'
  );

  // Attempt
  let $overviewSection = $overviewContainer.find('.information .attempt');
  assert.ok(
    $overviewSection.find('title'),
    'Header element for \'attempt\' section in overview is missing'
  );
  assert.equal(
    $overviewSection
      .find('.dropdown button')
      .text()
      .trim(),
    '4',
    'Current attempt value is incorrect'
  );
  assert.equal(
    $overviewSection.find('.dropdown-menu li').length,
    4,
    'Incorrect number of attempts in dropdown menu'
  );
  assert.equal(
    $overviewSection
      .find('.total-attempts')
      .text()
      .trim(),
    '4',
    'Incorrect number of total attempts'
  );

  // Date
  $overviewSection = $overviewContainer.find('.information .date');

  // Time
  $overviewSection = $overviewContainer.find('.information .time');
  assert.equal(
    $overviewSection
      .find('span')
      .text()
      .trim(),
    '1m',
    'Incorrect time value'
  );

  // Reaction
  var $reactionSection = $reactionContainer.find('.reaction');
  assert.ok(
    $reactionSection.find('.emotion').hasClass('emotion-2'),
    'Emotion icon should have the class \'emotion-2\''
  );

  // Links to questions
  const $questionLinks = $overviewContainer.find('.gru-bubbles');
  assert.equal(
    $questionLinks.find('li').length,
    0,
    'Incorrect number of question links'
  );

  this.set('areQuestionLinksHidden', true);
  assert.notOk(
    $overviewContainer.find('.gru-bubbles').length,
    'Question links hidden'
  );
});

test('Assessment attempts on real time', function(assert) {
  const date = new Date(2010, 1, 20);
  date.setSeconds(10);
  date.setMinutes(15);
  date.setHours(11);

  const contextResult = ContextResult.create({
    id: 501,
    resourceResults: [
      QuestionResult.create({
        id: 601,
        resource: {
          sequence: 1
        },
        score: 0,
        savedTime: 20000,
        reaction: 2
      }),
      QuestionResult.create({
        id: 603,
        resource: {
          sequence: 3
        },
        score: 100,
        savedTime: 20000,
        reaction: 2
      }),
      QuestionResult.create({
        id: 602,
        resource: {
          sequence: 2
        },
        score: 100,
        savedTime: 20000,
        reaction: 2
      })
    ],
    submittedAt: date,
    averageReaction: 2,
    totalTimeSpent: 60000,
    correctAnswers: 2,
    correctPercentage: 67,
    totalAttempts: 4
  });

  const collection = Collection.create({
    isCollection: false,
    resources: [],
    title: 'collection'
  });

  contextResult.merge(collection);
  this.set('contextResult', contextResult);
  this.set('areQuestionLinksHidden', false);
  this.set('showAttempts', false);
  this.set('isRealTime', false);

  this.render(hbs`
    {{reports/assessment/qz-summary
      contextResult=contextResult
      areQuestionLinksHidden=areQuestionLinksHidden
      showAttempts=showAttempts
      isRealTime=isRealTime
    }}`);

  const $component = this.$('.reports.assessment .qz-summary'); //component dom element

  const $gradeContainer = $component.find(
    '.summary-container .grade[style~=\'background-color:\']'
  );

  const $attempts = $gradeContainer.find('.attempts');
  assert.ok(
    $attempts.find('.current'),
    'Current attempt label should be visible'
  );
  assert.notOk(
    $attempts.find('.attempt-selector').length,
    'Attempts dropdown should not be visible'
  );
  assert.notOk(
    $attempts.find('.latest').length,
    'Latest attempt label should not be visible'
  );
});

test('Assessment attempts on static report', function(assert) {
  const date = new Date(2010, 1, 20);
  date.setSeconds(10);
  date.setMinutes(15);
  date.setHours(11);

  const contextResult = ContextResult.create({
    id: 501,
    resourceResults: [
      QuestionResult.create({
        id: 601,
        resource: {
          sequence: 1
        },
        score: 0,
        savedTime: 20000,
        reaction: 2
      }),
      QuestionResult.create({
        id: 603,
        resource: {
          sequence: 3
        },
        score: 100,
        savedTime: 20000,
        reaction: 2
      }),
      QuestionResult.create({
        id: 602,
        resource: {
          sequence: 2
        },
        score: 100,
        savedTime: 20000,
        reaction: 2
      })
    ],
    submittedAt: date,
    averageReaction: 2,
    totalTimeSpent: 60000,
    correctAnswers: 2,
    correctPercentage: 67,
    totalAttempts: 4
  });

  const collection = Collection.create({
    isCollection: false,
    resources: [],
    title: 'collection'
  });

  contextResult.merge(collection);
  this.set('contextResult', contextResult);
  this.set('areQuestionLinksHidden', false);
  this.set('showAttempts', false);

  this.render(hbs`
    {{reports/assessment/qz-summary
      contextResult=contextResult
      areQuestionLinksHidden=areQuestionLinksHidden
      showAttempts=showAttempts

    }}`);

  const $component = this.$('.reports.assessment.qz-summary'); //component dom element

  const $gradeContainer = $component.find(
    '.summary-container .grade[style~=\'background-color:\']'
  );

  const $attempts = $gradeContainer.find('.attempts');
  assert.ok(
    $attempts.find('.latest'),
    'latest attempt label should be visible'
  );
  assert.notOk(
    $attempts.find('.attempt-selector').length,
    'Attempts dropdown should not be visible'
  );
  assert.notOk(
    $attempts.find('.current').length,
    'Current attempt label should not be visible'
  );
});

test('it renders for collection', function(assert) {
  const date = new Date(2010, 1, 20);
  date.setSeconds(10);
  date.setMinutes(15);
  date.setHours(11);

  const contextResult = ContextResult.create({
    id: 501,
    resourceResults: [
      QuestionResult.create({
        id: 601,
        resource: {
          sequence: 1
        },
        score: 0,
        savedTime: 20000,
        reaction: 2
      }),
      QuestionResult.create({
        id: 603,
        resource: {
          sequence: 3
        },
        score: 100,
        savedTime: 20000,
        reaction: 2
      }),
      QuestionResult.create({
        id: 602,
        resource: {
          sequence: 2
        },
        score: 100,
        savedTime: 20000,
        reaction: 2
      })
    ],
    submittedAt: date,
    averageReaction: 2,
    totalTimeSpent: 60000,
    correctAnswers: 2,
    correctPercentage: 67,
    totalAttempts: 4,
    collection: null
  });

  const collection = Collection.create({
    isCollection: true,
    imageUrl: 'here.png',
    resources: [],
    title: 'collection'
  });
  contextResult.merge(collection);

  this.set('contextResult', contextResult);

  this.render(
    hbs`{{reports/assessment/qz-summary contextResult=contextResult}}`
  );

  const $component = this.$('.reports.assessment.qz-summary'); //component dom element
  assert.ok($component.length, 'Component does not have the component classes');

  const $gradeContainer = $component.find('.summary-container .grade');
  assert.ok(!$gradeContainer.length, 'Grade container should be visible');

  const $thumbnailContainer = $component.find('.summary-container .thumbnail');
  assert.ok(
    $thumbnailContainer.length,
    'thumbnail container should not be visible'
  );

  const $overviewContainer = $component.find('.summary-container .overview');
  assert.ok($overviewContainer.length, 'Overview container is missing');
  assert.ok($overviewContainer.find('h5').length, 'Header element is missing');
  assert.equal(
    $overviewContainer
      .find('h5')
      .text()
      .trim(),
    'collection',
    'Incorrect header text'
  );

  // Attempt
  let $overviewSection = $overviewContainer.find('.information .attempt');
  assert.ok(
    !$overviewSection.length,
    '\'attempt\' section should not be visible'
  );

  // Date
  $overviewSection = $overviewContainer.find('.information .date');

  // Time
  $overviewSection = $overviewContainer.find('.information .time');
  assert.equal(
    $overviewSection
      .find('span')
      .text()
      .trim(),
    '1m',
    'Incorrect time value'
  );

  // Reaction
  var $reactionContainer = $component.find('.summary-container .reactions');
  var $reactionSection = $reactionContainer.find('.reaction');
  assert.ok(
    $reactionSection.find('.emotion').hasClass('emotion-2'),
    'Emotion icon should have the class \'emotion-2\''
  );

  // Reaction
  const $questionLinks = $overviewContainer.find('.gru-bubbles');
  assert.equal(
    $questionLinks.find('li').length,
    0,
    'Incorrect number of resource links'
  );
});
