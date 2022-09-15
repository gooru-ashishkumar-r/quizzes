import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'reports/assessment/questions/qz-hs-text',
  'Integration | Component | reports/assessment/questions/qz hs text',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

test('Hot Spot Text Correct Answer', function(assert) {
  var question = Ember.Object.create({
    question: ResourceModel.create({
      id: '569906aadfa0072204f7c7c7',
      type: QUESTION_TYPES.hotSpotText,
      body: 'Hot spot text',
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
      ]),
      correctAnswer: Ember.A([
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
      ]),
      sequence: 1
    })
  });

  var showCorrect = true;
  this.set('question', question);
  this.set('showCorrect', showCorrect);
  this.render(
    hbs`{{reports/assessment/questions/qz-hs-text question=question showCorrect=showCorrect}}`
  );
  const $component = this.$(); //component dom element
  const $hsText = $component.find('.reports.assessment.questions.qz-hs-text');

  T.exists(
    assert,
    $hsText.find('li:eq(0).selected.correct'),
    'The first answer should be correct'
  );
  T.exists(
    assert,
    $hsText.find('li:eq(2).selected.correct'),
    'The third answer should be correct'
  );
  T.notExists(
    assert,
    $hsText.find('li.incorrect'),
    'Should not be incorrect answers at all'
  );
});

test('Hot Spot Text Your Answer Incorrect', function(assert) {
  var question = Ember.Object.create({
    question: ResourceModel.create({
      id: '569906aadfa0072204f7c7c7',
      type: QUESTION_TYPES.hotSpotText,
      body: 'Hot spot text',
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
      ]),
      correctAnswer: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'An aquifer'
        }),
        AnswerModel.create({
          value: '2',
          text: 'A well'
        })
      ]),
      sequence: 1
    })
  });

  var userAnswer = Ember.A([{ value: '1' }, { value: '3' }]);

  this.set('question', question);
  this.set('userAnswer', userAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-hs-text question=question userAnswer=userAnswer}}`
  );
  const $component = this.$(); //component dom element
  const $hsText = $component.find('.reports.assessment.questions.qz-hs-text');

  T.exists(
    assert,
    $hsText.find('li:eq(0).selected.correct'),
    'The first answer should be correct and selected'
  );
  T.exists(
    assert,
    $hsText.find('li:eq(2).selected.incorrect'),
    'The third answer should be incorrect and selected'
  );
  T.notExists(
    assert,
    $hsText.find('li:eq(1).selected'),
    'The second answer should not be selected'
  );
});

test('Hot Spot Text Your Answer Correct', function(assert) {
  var question = Ember.Object.create({
    question: ResourceModel.create({
      id: '569906aadfa0072204f7c7c7',
      type: QUESTION_TYPES.hotSpotText,
      body: 'Hot spot text',
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
      ]),
      correctAnswer: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'An aquifer'
        }),
        AnswerModel.create({
          value: '2',
          text: 'A well'
        })
      ]),
      sequence: 1
    })
  });

  var userAnswer = Ember.A([{ value: '1' }, { value: '2' }]);

  this.set('question', question);
  this.set('userAnswer', userAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-hs-text question=question userAnswer=userAnswer}}`
  );
  const $component = this.$(); //component dom element
  const $hsText = $component.find('.reports.assessment.questions.qz-hs-text');

  T.exists(
    assert,
    $hsText.find('li:eq(0).selected.correct'),
    'The first answer should be correct'
  );
  T.exists(
    assert,
    $hsText.find('li:eq(1).selected.correct'),
    'The second answer should be correct'
  );
  T.notExists(
    assert,
    $hsText.find('li.incorrect'),
    'Should not be incorrect answers at all'
  );
});

test('Hot Spot Text Anonymous', function(assert) {
  var question = Ember.Object.create({
    question: ResourceModel.create({
      id: '569906aadfa0072204f7c7c7',
      type: QUESTION_TYPES.hotSpotText,
      body: 'Hot spot text',
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
      ]),
      correctAnswer: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'An aquifer'
        }),
        AnswerModel.create({
          value: '2',
          text: 'A well'
        })
      ]),
      sequence: 1
    })
  });

  var userAnswer = Ember.A([{ value: '1' }, { value: '3' }]);

  this.set('question', question);
  this.set('userAnswer', userAnswer);

  this.render(
    hbs`{{reports/assessment/questions/qz-hs-text question=question userAnswer=userAnswer anonymous=true}}`
  );
  const $component = this.$(); //component dom element
  const $hsText = $component.find('.reports.assessment.questions.qz-hs-text');

  T.exists(
    assert,
    $hsText.find('li:eq(0).selected.anonymous'),
    'The first answer should be anonymous'
  );
  T.exists(
    assert,
    $hsText.find('li:eq(2).selected.anonymous'),
    'The third answer should be anonymous'
  );
});
