import Ember from 'ember';
import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';
//import ModalMixin from 'quizzes-addon/mixins/modal';

const configurationServiceStub = Ember.Service.extend({
  configuration: {
    properties: {
      cdnURL: 'cdnURL/'
    }
  }
});

moduleForComponent(
  'player/questions/qz-hs-image',
  'Integration | Component | player/questions/qz hs image',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.register('service:quizzes/configuration', configurationServiceStub);
      this.inject.service('quizzes/configuration');
    }
  }
);

test('Layout', function(assert) {
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotImage,
    body: 'Hot spot image',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'url1.jpg'
      }),
      AnswerModel.create({
        value: '2',
        text: 'url2.jpg'
      }),
      AnswerModel.create({
        value: '3',
        text: 'url3.jpg'
      })
    ]),
    sequence: 1
  });

  this.set('question', question);

  this.render(hbs`{{player/questions/qz-hs-image question=question}}`);

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.ok($component.find('.instructions'), 'Missing instructions');
  assert.equal(
    $answersContainer.find('li.answer').length,
    3,
    'Incorrect number of answer choices'
  );

  assert.equal(
    $answersContainer.find('li.answer:first-child').data('id'),
    '1',
    'First answer choice, data-id value is incorrect'
  );
  const $firstImage = $answersContainer.find('li.answer:first-child img');
  assert.ok(
    $firstImage.prop('src').indexOf('cdnURL/url1.jpg') >= 0,
    'First image path is not set correctly'
  );
  assert.equal(
    $answersContainer.find('li.answer:last-child').data('id'),
    '3',
    'Last answer choice, data-id value is incorrect'
  );
  const $image = $answersContainer.find('li.answer:last-child img');
  assert.ok(
    $image.prop('src').indexOf('cdnURL/url3.jpg') >= 0,
    'Last image path is not set correctly'
  );
});

skip('Selecting answers', function(assert) {
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotImage,
    body: 'Hot spot image',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'url1.jpg'
      }),
      AnswerModel.create({
        value: '2',
        text: 'url2.jpg'
      }),
      AnswerModel.create({
        value: '3',
        text: 'url3.jpg'
      })
    ]),
    sequence: 1
  });

  this.set('question', question);

  this.render(hbs`{{player/questions/qz-hs-image question=question}}`);

  const $answers = this.$('li.answer');
  const $firstAnswer = $answers.eq(0);
  const $secondAnswer = $answers.eq(1);

  assert.equal(
    this.$('li.selected').length,
    0,
    'Initial number of answers selected is incorrect'
  );

  $firstAnswer.click();

  console.log('$firstAnswer', $firstAnswer); //eslint-disable-line
  console.log('$secondAnswer', $secondAnswer); //eslint-disable-line

  assert.ok(
    $firstAnswer.hasClass('selected'),
    'First answer should have been selected'
  );

  $secondAnswer.click();
  assert.ok(
    $secondAnswer.hasClass('selected'),
    'Second answer should have been selected'
  );
  assert.equal(
    this.$('li.selected').length,
    2,
    'Incorrect number of answers selected'
  );

  $firstAnswer.click();
  assert.ok(
    !$firstAnswer.hasClass('selected'),
    'First answer should have been deselected'
  );
  assert.equal(
    this.$('li.selected').length,
    1,
    'Incorrect number of answers selected'
  );

  $secondAnswer.click();
  assert.ok(
    !$secondAnswer.hasClass('selected'),
    'Second answer should have been deselected'
  );
  assert.equal(
    this.$('li.selected').length,
    0,
    'Incorrect number of answers selected'
  );
});

skip('Notifications work after selecting questions', function(assert) {
  assert.expect(12);
  let answers = [];
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotImage,
    body: 'Hot spot image',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'url1.jpg'
      }),
      AnswerModel.create({
        value: '2',
        text: 'url2.jpg'
      }),
      AnswerModel.create({
        value: '3',
        text: 'url3.jpg'
      }),
      AnswerModel.create({
        value: '4',
        text: 'url4.jpg'
      })
    ]),
    sequence: 1
  });

  this.set('question', question);

  this.on('changeAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer changed, but the answers are not correct'
    );
  });

  this.on('completeAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer completed, but the answers are not correct'
    );
  });

  this.on('clearAnswer', function(question, answer) {
    assert.deepEqual(
      answer,
      answers,
      'Answer cleared, but the answers are not correct'
    );
  });

  this.render(hbs`{{player/questions/qz-hs-image question=question
                    onAnswerChanged='changeAnswer'
                    onAnswerCompleted='completeAnswer'
                    onAnswerCleared='clearAnswer' }}`);

  const $answers = this.$('li.answer');

  // Select first answer
  answers = [{ value: 1 }];
  $answers.eq(0).click();

  answers = [{ value: 1 }, { value: 3 }];
  $answers.eq(2).click();

  // Three answers selected
  answers = [{ value: 1 }, { value: 3 }, { value: 4 }];
  $answers.eq(3).click();

  // Now, test deselecting all answers
  answers = [{ value: 1 }, { value: 4 }];
  $answers.eq(2).click();

  answers = [{ value: 4 }];
  $answers.eq(0).click();

  // Send onAnswerCleared notification
  answers = [];
  $answers.eq(3).click();
});

test('Layout - read only', function(assert) {
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotImage,
    body: 'Hot spot image',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'url1.jpg'
      }),
      AnswerModel.create({
        value: '2',
        text: 'url2.jpg'
      }),
      AnswerModel.create({
        value: '3',
        text: 'url3.jpg'
      })
    ]),
    sequence: 1
  });

  this.set('question', question);

  this.render(
    hbs`{{player/questions/qz-hs-image question=question readOnly=true}}`
  );

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.equal(
    $answersContainer.find('li.answer.disabled').length,
    3,
    'Incorrect number of answer choices'
  );
});

test('Layout - with user answer', function(assert) {
  assert.expect(4);
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotImage,
    body: 'Hot spot image',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'url1.jpg'
      }),
      AnswerModel.create({
        value: '2',
        text: 'url2.jpg'
      }),
      AnswerModel.create({
        value: '3',
        text: 'url3.jpg'
      })
    ]),
    sequence: 1
  });

  const answers = [{ value: 2 }];
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
  this.set('userAnswer', [{ value: 2 }]);

  this.render(hbs`{{player/questions/qz-hs-image question=question
                    userAnswer=userAnswer
                    onAnswerChanged='changeAnswer'
                    onAnswerLoaded='loadAnswer'}}`);

  const $component = this.$(); //component dom element
  const $answersContainer = $component.find('.answer-choices');

  assert.equal(
    $answersContainer.find('li.answer').length,
    3,
    'Incorrect number of answer choices'
  );
  assert.equal(
    $answersContainer.find('li.answer.selected').length,
    1,
    'One should be selected'
  );
});
