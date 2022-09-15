import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import QuestionResult from 'quizzes-addon/models/result/question';
import T from 'dummy/tests/helpers/assert';
import AnswerModel from 'quizzes-addon/models/resource/answer';
import RubricModel from 'quizzes-addon/models/rubric/rubric';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'player/qz-question-viewer',
  'Integration | Component | player/qz question viewer',
  {
    integration: true,
    beforeEach: function() {
      this.i18n = this.container.lookup('service:i18n');
      this.i18n.set('locale', 'en');
    }
  }
);

test('Layout', function(assert) {
  assert.expect(8);

  const question = Ember.Object.create({
    id: 10,
    type: QUESTION_TYPES.multipleAnswer,
    body: 'Sample Question SC',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'An aquifer'
      }),
      AnswerModel.create({
        value: '2',
        text: 'A well'
      }),
      AnswerModel.create({
        value: '3',
        text: 'A pump'
      })
    ])
  });

  const questionResult = QuestionResult.create();

  this.set('questionResult', questionResult);
  this.set('question', question);

  this.render(
    hbs`{{player/qz-question-viewer question=question questionResult=questionResult}}`
  );

  var $component = this.$(); //component dom element

  var $questionPanel = $component.find('.question-panel');
  T.exists(assert, $questionPanel, 'Missing question panel');
  T.exists(assert, $questionPanel.find('h2'), 'Missing question header');
  T.exists(
    assert,
    $questionPanel.find('.question span'),
    'Missing question text'
  );

  var $answerPanel = $component.find('.answers-panel');
  T.exists(assert, $answerPanel, 'Missing answer panel');
  T.exists(assert, $answerPanel.find('h2'), 'Missing answer header');
  T.exists(
    assert,
    $answerPanel.find('.qz-multiple-answer'),
    'Missing MA question component'
  );

  // There will be two question information sections in the page; however, only one will be
  // visible depending on a screen width breakpoint
  var $infoPanel = $component.find('.question-information').eq(0);
  assert.ok($infoPanel.find('button.hint'), 'Missing hint button');
  assert.ok(
    $infoPanel.find('button.explanation'),
    'Missing explanation button'
  );
});

test('Submit button should become enabled and call action on submit', function(assert) {
  assert.expect(1);

  const question = Ember.Object.create({
    id: 10,
    sequence: 2,
    body: 'Dummy question text',
    type: QUESTION_TYPES.trueFalse,
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'True'
      }),
      AnswerModel.create({
        value: '2',
        text: 'False'
      })
    ])
  });

  const questionResult = QuestionResult.create();

  this.set('questionResult', questionResult);
  this.set('question', question);

  this.on('mySubmitQuestion', function(question, questionResult) {
    assert.equal(question.get('id'), 10, 'Wrong id');
    assert.equal(
      questionResult.get('answer.firstObject.value'),
      '2',
      'Wrong answer'
    );
  });
  this
    .render(hbs`{{player/qz-question-viewer question=question questionResult=questionResult
      onSubmitQuestion='mySubmitQuestion'}}`);

  var $component = this.$(); //component dom element

  var $answerPanel = $component.find('.answers-panel');

  var $trueFalse = $answerPanel.find('.qz-true-false');
  $trueFalse.find('.answer-choices .radio input[type=radio]:eq(1)').click();

  assert.ok(
    !$answerPanel.find('.actions button.save').attr('disabled'),
    'Button should not be disabled'
  );

  $answerPanel.find('.actions button.save').click();
});

test('Clicking on the "Hints" button should display a certain number of hints and then become disabled', function(assert) {
  const question = Ember.Object.create({
    id: 10,
    sequence: 2,
    text: 'Dummy question text',
    type: QUESTION_TYPES.trueFalse,
    hasMedia: false,
    correctAnswer: Ember.A([AnswerModel.create({ value: '1', text: 'True' })]),
    answers: Ember.A([
      AnswerModel.create({ value: '1', text: 'True' }),
      AnswerModel.create({ value: '2', text: 'False' })
    ]),
    hints: [
      {
        hintId: 790,
        hintText: 'Hints text 1',
        sequence: 1
      },
      {
        hintId: 791,
        hintText: 'Hints text 2',
        sequence: 2
      }
    ]
  });
  const questionResult = QuestionResult.create();

  this.set('questionResult', questionResult);
  this.set('question', question);

  this.render(
    hbs`{{player/qz-question-viewer question=question questionResult=questionResult}}`
  );

  var $infoSection = this.$('.question-panel').eq(0);
  assert.ok($infoSection.find('.hints'), 'Missing hints section');
  assert.equal(
    $infoSection.find('.hints li').length,
    0,
    'No hints should be visible'
  );

  $infoSection.find('.btn-group .hint').click();
  assert.equal(
    $infoSection.find('.hints li').length,
    1,
    'Hint should be displayed'
  );
  assert.equal(
    $infoSection
      .find('.hints li:first-child')
      .text()
      .trim(),
    'Hints text 1',
    'Hint\'s content is incorrect'
  );
  assert.ok(
    !$infoSection.find('.btn-group .hint').attr('disabled'),
    'Hint button should not be disabled'
  );

  $infoSection.find('.btn-group .hint').click();
  assert.equal(
    $infoSection.find('.hints li').length,
    2,
    'Hints should be displayed'
  );
  assert.equal(
    $infoSection
      .find('.hints li:last-child')
      .text()
      .trim(),
    'Hints text 2',
    'Hint\'s content is incorrect'
  );
  assert.ok(
    $infoSection.find('.btn-group .hint').attr('disabled'),
    'Hint button should be disabled'
  );
});

test('Clicking on the "Explanation" button should display an explanation and then it should become disabled', function(assert) {
  const question = Ember.Object.create({
    id: 11,
    sequence: 2,
    text: 'Dummy question text',
    type: QUESTION_TYPES.trueFalse,
    hasMedia: false,
    correctAnswer: Ember.A([AnswerModel.create({ value: '1', text: 'True' })]),
    answers: Ember.A([
      AnswerModel.create({ value: '1', text: 'True' }),
      AnswerModel.create({ value: '2', text: 'False' })
    ]),
    hints: [],
    explanation: '<p>This is a test explanation</p>'
  });

  const questionResult = QuestionResult.create();

  this.set('questionResult', questionResult);
  this.set('question', question);
  this.render(
    hbs`{{player/qz-question-viewer question=question questionResult=questionResult}}`
  );

  var $infoSection = this.$('.question-panel').eq(0);
  assert.ok(
    !$infoSection.find('.btn-group .explanation').attr('disabled'),
    'Explanation button should be enabled'
  );
  assert.ok(
    !$infoSection.find(' > .explanation').length,
    'Explanation section should not be visible'
  );

  $infoSection.find('.btn-group .explanation').click();
  assert.ok(
    $infoSection.find('> .explanation').length,
    1,
    'Explanation should be displayed'
  );
  assert.equal(
    $infoSection
      .find('.panel.explanation .panel-body .explanation p')
      .text()
      .trim(),
    'This is a test explanation',
    'Explanation does not display the right content'
  );
  assert.ok(
    $infoSection.find('.btn-group .explanation').attr('disabled'),
    'Explanation button should be disabled'
  );
});

test('Question Viewer Submit by Enter', function(assert) {
  const question = Ember.Object.create({
    id: 10,
    sequence: 2,
    text: 'Dummy question text',
    mediaUrl: 'test.jpg',
    type: QUESTION_TYPES.singleChoice,
    hasMedia: true
  });

  const questionResult = QuestionResult.create();

  this.set('questionResult', questionResult);
  this.set('question', question);

  this.on('mySubmitQuestion', function(question) {
    assert.equal(question.get('id'), 10, 'Wrong id');
  });
  this
    .render(hbs`{{player/qz-question-viewer question=question questionResult=questionResult
      onSubmitQuestion='mySubmitQuestion' isSubmitDisabled=false}}`);

  var $component = this.$(); //component dom element

  var e = $.Event('keyup');
  e.which = 13; //ENTER
  $component.find('.qz-question-viewer').trigger(e);
});

test('Open ended question try submit by enter', function(assert) {
  const question = Ember.Object.create({
    id: 10,
    sequence: 2,
    text: 'Dummy question text',
    mediaUrl: 'test.jpg',
    type: QUESTION_TYPES.trueFalse,
    isOpenEnded: true,
    hasMedia: true,
    answers: Ember.A([
      AnswerModel.create({ value: '1', text: 'True' }),
      AnswerModel.create({ value: '2', text: 'False' })
    ])
  });

  const questionResult = QuestionResult.create();

  this.set('questionResult', questionResult);
  this.set('question', question);

  this.on('mySubmitQuestion', function() {
    assert.ok(false, '');
  });
  this
    .render(hbs`{{player/qz-question-viewer question=question questionResult=questionResult
      onSubmitQuestion='mySubmitQuestion' isSubmitDisabled=false}}`);

  var $component = this.$(); //component dom element

  var e = $.Event('keyup');
  e.which = 13; //ENTER
  $component.find('.qz-question-viewer').trigger(e);

  assert.ok(true);
});

test('Question viewer body when question type is FIB', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: 'text_entry',
    body: 'The sun is [] and the moon []',
    hints: [],
    explanation: 'Sample explanation text',
    answers: Ember.A([
      AnswerModel.create({
        value: 'yellow',
        text: 'yellow'
      }),
      AnswerModel.create({
        value: 'white',
        text: 'white'
      })
    ]),
    sequence: 1,
    hasAnswers: true
  });

  this.set('question', question);

  this.render(hbs`{{player/qz-question-viewer question=question }}`);
  const $component = this.$();
  const $questionViewer = $component.find('.qz-question-viewer');
  assert.equal(
    $questionViewer.find('.question .gru-math-text').text(),
    'The sun is _______ and the moon _______',
    'Incorrect text'
  );
});

test('Question viewer body when question type is FIB', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: 'hot_text_word',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true
  });

  this.set('question', question);

  this.render(hbs`{{player/qz-question-viewer question=question }}`);
  const $component = this.$();
  const $questionViewer = $component.find('.qz-question-viewer');
  assert.equal(
    $questionViewer.find('.question .gru-math-text').text(),
    'Sample description text',
    'Incorrect text'
  );
});

test('Question viewer when question type is Free Response', function(assert) {
  const question = ResourceModel.create({
    id: '569906aacea8416665209d53',
    type: QUESTION_TYPES.openEnded,
    body: '',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true,
    rubric: RubricModel.create({
      id: '1234'
    })
  });

  this.set('question', question);

  this.render(hbs`{{player/qz-question-viewer question=question }}`);
  const $component = this.$();
  const $questionViewer = $component.find('.qz-question-viewer');
  assert.ok(
    $questionViewer.find('.qz-free-response-viewer').length,
    'Missing free response viewer'
  );
});
