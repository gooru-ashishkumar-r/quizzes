import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import ResourceModel from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'player/questions/qz-hot-text-highlight',
  'Integration | Component | player/questions/qz hot text highlight',
  {
    integration: true
  }
);

test('Layout', function(assert) {
  assert.expect(4);

  const question = ResourceModel.create({
    id: '569906aa68f276ae7ea03c30',
    type: QUESTION_TYPES.hotTextHighlightSentence,
    body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5'
  });

  this.set('question', question);

  this.render(
    hbs`{{player/questions/qz-hot-text-highlight question=question}}`
  );

  var $component = this.$(), //component dom element
    $phrasesContainer = $component.find('.phrases');

  assert.ok($component.find('.instructions'), 'Missing instructions');
  assert.ok($component.find('.phrases'), 'Missing phrases');
  assert.equal(
    $phrasesContainer.find('span.item').length,
    5,
    'Incorrect number of sentences'
  );
  assert.equal(
    $phrasesContainer.find('span.item.selected').length,
    0,
    'Incorrect number of sentences selected'
  );
});

test('markItem', function(assert) {
  assert.expect(14);

  const question = ResourceModel.create({
    id: '569906aa68f276ae7ea03c30',
    type: QUESTION_TYPES.hotTextHighlightSentence,
    body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5'
  });

  let answers = [];

  this.set('question', question);
  this.on('myOnAnswerChanged', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer changed, but the answers are not correct'
    );
  });

  this.on('myOnAnswerCompleted', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer completed, but the answers are not correct'
    );
  });

  this.on('myOnAnswerCleared', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer cleared, but the answers are not correct'
    );
  });

  this.render(hbs`{{player/questions/qz-hot-text-highlight
        question=question
        onAnswerChanged='myOnAnswerChanged'
        onAnswerCleared='myOnAnswerCleared'
        onAnswerCompleted='myOnAnswerCompleted'}}`);

  var $component = this.$(), //component dom element
    $phrasesContainer = $component.find('.phrases'),
    $item1 = $phrasesContainer.find('span.item:eq(1)'),
    $item3 = $phrasesContainer.find('span.item:eq(3)');

  //selecting items
  answers = [{ value: 'Sentence 2.,12' }];
  $item1.click();
  assert.ok($item1.hasClass('selected'), 'Item 1 should be selected');

  answers = [{ value: 'Sentence 2.,12' }, { value: 'Sentence 4.,36' }];
  $item3.click();
  assert.ok($item3.hasClass('selected'), 'Item 3 should be selected');

  //deselecting items
  answers = [{ value: 'Sentence 4.,36' }];
  $item1.click();
  assert.ok(!$item1.hasClass('selected'), 'Item 1 should not be selected');
  assert.ok($item3.hasClass('selected'), 'Item 3 should be selected');

  answers = [];
  $item3.click();
  assert.ok(!$item1.hasClass('selected'), 'Item 1 should not be selected');
  assert.ok(!$item3.hasClass('selected'), 'Item 3 should not be selected');
});

test('Layout - read only', function(assert) {
  assert.expect(1);

  const question = ResourceModel.create({
    id: '569906aa68f276ae7ea03c30',
    type: QUESTION_TYPES.hotTextHighlightSentence,
    body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5'
  });

  this.set('question', question);

  this.render(
    hbs`{{player/questions/qz-hot-text-highlight question=question readOnly=true}}`
  );

  var $component = this.$(), //component dom element
    $phrasesContainer = $component.find('.phrases');

  assert.equal(
    $phrasesContainer.find('span.item.disabled').length,
    5,
    'Incorrect number of sentences'
  );
});

test('Layout - with user answer', function(assert) {
  assert.expect(4);

  const question = ResourceModel.create({
    id: '569906aa68f276ae7ea03c30',
    type: QUESTION_TYPES.hotTextHighlightSentence,
    body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5'
  });

  const answers = [{ value: 'Sentence 2.,12' }, { value: 'Sentence 4.,36' }];
  this.on('changeAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer changed, but the answers are not correct'
    );
  });
  this.on('loadAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer loaded, but the answers are not correct'
    );
  });
  this.set('question', question);
  this.set('userAnswer', answers);

  this.render(hbs`{{player/questions/qz-hot-text-highlight question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  var $component = this.$(), //component dom element
    $phrasesContainer = $component.find('.phrases');

  assert.equal(
    $phrasesContainer.find('span.item').length,
    5,
    'Incorrect number of sentences'
  );
  assert.equal(
    $phrasesContainer.find('span.item.selected').length,
    2,
    '2 should be selected'
  );
});

test('Set two questions', function(assert) {
  assert.expect(2);

  const question = ResourceModel.create({
    id: '569906aa68f276ae7ea03c30',
    type: QUESTION_TYPES.hotTextHighlightSentence,
    body: 'Sentence 1. Sentence 2. Sentence 3. Sentence 4. Sentence 5'
  });

  const question1 = ResourceModel.create({
    id: '569906aa68f276ae7ea03c30',
    type: QUESTION_TYPES.hotTextHighlightSentence,
    body: 'Question 2. Sentence 2. Question 2. Sentence 4. Question 2'
  });

  this.set('question', question);

  this.render(
    hbs`{{player/questions/qz-hot-text-highlight question=question}}`
  );

  var $component = this.$(), //component dom element
    $phrasesContainer = $component.find('.phrases');

  assert.equal(
    $phrasesContainer.find('span:nth-child(1)').text().trim(),
    'Sentence 1.',
    'Incorrect answer'
  );

  this.set('question', question1);

  assert.equal(
    $phrasesContainer.find('span:nth-child(1)').text().trim(),
    'Question 2.',
    'Incorrect answer'
  );
});
