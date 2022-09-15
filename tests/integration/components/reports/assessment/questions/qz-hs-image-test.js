import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';
import { DEFAULT_IMAGES } from 'quizzes-addon/config/quizzes-config';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';

const configurationServiceStub = Ember.Service.extend({
  configuration: {
    properties: {
      cdnURL: 'cdnURL/'
    }
  }
});

moduleForComponent(
  'reports/assessment/questions/qz-hs-image',
  'Integration | Component | reports/assessment/questions/qz hs image',
  {
    integration: true,
    beforeEach: function() {
      this.register('service:quizzes/configuration', configurationServiceStub);
      this.inject.service('quizzes/configuration');
    }
  }
);

test('Hot Spot Image Correct Answer', function(assert) {
  var question = Ember.Object.create({
    question: ResourceModel.create({
      id: '569906aadfa0072204f7c7c7',
      type: QUESTION_TYPES.hotSpotImage,
      body: 'Hot spot text',
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
          text: ''
        })
      ]),
      correctAnswer: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'url1.jpg'
        }),
        AnswerModel.create({
          value: '2',
          text: 'url3.jpg'
        }),
        AnswerModel.create({
          value: '3',
          text: ''
        })
      ]),
      sequence: 1
    })
  });

  var showCorrect = true;
  this.set('question', question);
  this.set('showCorrect', showCorrect);
  this.render(
    hbs`{{reports/assessment/questions/qz-hs-image question=question showCorrect=showCorrect}}`
  );
  const $component = this.$(); //component dom element
  const $hsImage = $component.find('.reports.assessment.questions.qz-hs-image');

  T.exists(
    assert,
    $hsImage.find('li:eq(0) span.correct'),
    'The first answer should be correct'
  );
  assert.ok(
    $hsImage.find('li:eq(0) span img').prop('src').indexOf('cdnURL/url1.jpg') >=
      0,
    'First image src does not coincide'
  );
  T.exists(
    assert,
    $hsImage.find('li:eq(2) span.correct'),
    'The third answer should be correct'
  );
  assert.ok(
    $hsImage
      .find('li:eq(2) span img')
      .prop('src')
      .indexOf(DEFAULT_IMAGES.QUESTION_PLACEHOLDER_IMAGE) >= 0,
    'Image with empty image value should have a placeholder image'
  );
  T.notExists(
    assert,
    $hsImage.find('li span.incorrect'),
    'Should not be incorrect answers at all'
  );
});

test('Hot Spot Image Your Answer Incorrect', function(assert) {
  var question = Ember.Object.create({
    question: ResourceModel.create({
      id: '569906aadfa0072204f7c7c7',
      type: QUESTION_TYPES.hotSpotImage,
      body: 'Hot spot text',
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
      correctAnswer: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'url1.jpg'
        }),
        AnswerModel.create({
          value: '3',
          text: 'url3.jpg'
        })
      ]),
      sequence: 1
    })
  });

  var userAnswer = Ember.A([{ value: '1' }, { value: '2' }]);

  this.set('question', question);
  this.set('userAnswer', userAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-hs-image question=question userAnswer=userAnswer}}`
  );
  const $component = this.$(); //component dom element
  const $hsImage = $component.find('.reports.assessment.questions.qz-hs-image');

  T.exists(
    assert,
    $hsImage.find('li:eq(0) span.selected.correct'),
    'The first answer should be correct and selected'
  );
  T.exists(
    assert,
    $hsImage.find('li:eq(1) span.selected.incorrect'),
    'The second answer should be incorrect and selected'
  );
  T.exists(
    assert,
    $hsImage.find('li:eq(2) span.no-selected'),
    'The third answer should not be selected'
  );
});

test('Hot Spot Image Your Answer Correct', function(assert) {
  var question = Ember.Object.create({
    question: ResourceModel.create({
      id: '569906aadfa0072204f7c7c7',
      type: QUESTION_TYPES.hotSpotImage,
      body: 'Hot spot text',
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
      correctAnswer: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'url1.jpg'
        }),
        AnswerModel.create({
          value: '3',
          text: 'url3.jpg'
        })
      ]),
      sequence: 1
    })
  });

  var userAnswer = Ember.A([{ value: '1' }, { value: '3' }]);

  this.set('question', question);
  this.set('userAnswer', userAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-hs-image question=question userAnswer=userAnswer}}`
  );
  const $component = this.$(); //component dom element
  const $hsImage = $component.find('.reports.assessment.questions.qz-hs-image');

  T.exists(
    assert,
    $hsImage.find('li:eq(0) span.selected.correct'),
    'The first answer should be correct and selected'
  );
  T.exists(
    assert,
    $hsImage.find('li:eq(1) span.no-selected'),
    'The second answer should not be selected'
  );
  T.exists(
    assert,
    $hsImage.find('li:eq(2) span.selected.correct'),
    'The third answer should be correct and selected'
  );
  T.notExists(
    assert,
    $hsImage.find('li span.incorrect'),
    'Should not be incorrect answers at all'
  );
});

test('Hot Spot Image anonymous', function(assert) {
  var question = Ember.Object.create({
    question: ResourceModel.create({
      id: '569906aadfa0072204f7c7c7',
      type: QUESTION_TYPES.hotSpotImage,
      body: 'Hot spot text',
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
      correctAnswer: Ember.A([
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
    })
  });

  var userAnswer = Ember.A([{ value: '1' }, { value: '3' }]);

  this.set('question', question);
  this.set('userAnswer', userAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-hs-image question=question userAnswer=userAnswer anonymous=true}}`
  );
  const $component = this.$(); //component dom element
  const $hsImage = $component.find('.reports.assessment.questions.qz-hs-image');

  T.exists(
    assert,
    $hsImage.find('li:eq(0) span.selected.anonymous'),
    'The first answer should be anonymous'
  );
  T.exists(
    assert,
    $hsImage.find('li:eq(1) span.no-selected'),
    'The second answer should not be selected'
  );
  T.exists(
    assert,
    $hsImage.find('li:eq(2) span.selected.anonymous'),
    'The third answer should be anonymous and selected'
  );
});
