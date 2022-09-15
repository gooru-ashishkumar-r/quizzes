import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'reports/assessment/questions/qz-hs-text',
  'Unit | Component | reports/assessment/questions/qz hs text',
  {
    integration: false
  }
);

test('answers show correct answer', function(assert) {
  const component = this.subject();
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
  component.set('question', question);
  component.set('showCorrect', true);
  assert.equal(
    component.get('answers')[0].text,
    'An aquifer',
    'Incorrect text'
  );
  assert.equal(component.get('answers')[0].class, 'correct', 'Incorrect class');
  assert.equal(
    component.get('answers')[0].selected,
    true,
    'Answer 1 should be selected'
  );
  assert.equal(component.get('answers')[1].text, 'A well', 'Incorrect text');
  assert.equal(
    component.get('answers')[1].class,
    'correct',
    'Incorrect class,should be correct'
  );
  assert.equal(
    component.get('answers')[1].selected,
    true,
    'Answer 2 should be selected'
  );
});

test('answers show user answer anonymous', function(assert) {
  const component = this.subject();
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
  var userAnswer = Ember.A([{ value: '2' }]);

  component.set('question', question);
  component.set('userAnswer', userAnswer);
  component.set('anonymous', true);

  assert.equal(component.get('answers')[1].text, 'A well', 'Incorrect text');
  assert.equal(
    component.get('answers')[1].class,
    'anonymous',
    'Incorrect class,should be anonymous'
  );
  assert.equal(
    component.get('answers')[1].selected,
    true,
    'Answer 2 should be selected'
  );
});

test('answers show user answer correct and incorrect', function(assert) {
  const component = this.subject();
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
        })
      ]),
      correctAnswer: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'An aquifer'
        })
      ]),
      sequence: 1
    })
  });
  var userAnswer = Ember.A([{ value: '1' }, { value: '2' }]);

  component.set('question', question);
  component.set('userAnswer', userAnswer);

  assert.equal(
    component.get('answers')[0].text,
    'An aquifer',
    'Incorrect text'
  );
  assert.equal(component.get('answers')[0].class, 'correct', 'Incorrect class');
  assert.equal(
    component.get('answers')[0].selected,
    true,
    'Answer 1 should be selected'
  );
  assert.equal(component.get('answers')[1].text, 'A well', 'Incorrect text');
  assert.equal(
    component.get('answers')[1].class,
    'incorrect',
    'Incorrect class,should be incorrect'
  );
  assert.equal(
    component.get('answers')[1].selected,
    true,
    'Answer 2 should not be selected'
  );
});
