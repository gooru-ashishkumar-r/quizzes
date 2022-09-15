import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

const configurationServiceStub = Ember.Service.extend({
  configuration: {
    properties: {
      cdnURL: 'cdnURL/'
    }
  }
});

moduleForComponent(
  'reports/assessment/questions/qz-hs-image',
  'Unit | Component | reports/assessment/questions/qz hs image',
  {
    integration: false,
    beforeEach: function() {
      this.register('service:quizzes/configuration', configurationServiceStub);
      this.inject.service('quizzes/configuration');
    }
  }
);

test('answers show correct answer', function(assert) {
  const component = this.subject();
  var question = Ember.Object.create({
    question: ResourceModel.create({
      id: '569906aadfa0072204f7c7c7',
      type: QUESTION_TYPES.hotSpotImage,
      body: 'Hot spot image',
      answers: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'url1.png'
        }),
        AnswerModel.create({
          value: '2',
          text: 'url2.png'
        })
      ]),
      correctAnswer: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'url1.png'
        }),
        AnswerModel.create({
          value: '2',
          text: 'url2.png'
        })
      ]),
      sequence: 1
    })
  });
  component.set('question', question);
  component.set('showCorrect', true);
  assert.equal(
    component.get('answers')[0].image,
    'cdnURL/url1.png',
    'Incorrect text'
  );
  assert.equal(component.get('answers')[0].class, 'correct', 'Incorrect class');
  assert.equal(
    component.get('answers')[0].selected,
    true,
    'Answer 1 should be selected'
  );
  assert.equal(
    component.get('answers')[1].image,
    'cdnURL/url2.png',
    'Incorrect text'
  );
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
        })
      ]),
      sequence: 1
    })
  });
  var userAnswer = Ember.A([{ value: '2' }]);

  component.set('question', question);
  component.set('userAnswer', userAnswer);
  component.set('anonymous', true);

  assert.equal(
    component.get('answers')[1].image,
    'cdnURL/url2.jpg',
    'Incorrect text'
  );
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
        })
      ]),
      correctAnswer: Ember.A([
        AnswerModel.create({
          value: '1',
          text: 'url1.jpg'
        })
      ]),
      sequence: 1
    })
  });
  var userAnswer = Ember.A([{ value: '1' }, { value: '2' }]);

  component.set('question', question);
  component.set('userAnswer', userAnswer);

  assert.equal(
    component.get('answers')[0].image,
    'cdnURL/url1.jpg',
    'Incorrect text'
  );
  assert.equal(component.get('answers')[0].class, 'correct', 'Incorrect class');
  assert.equal(
    component.get('answers')[0].selected,
    true,
    'Answer 1 should be selected'
  );
  assert.equal(
    component.get('answers')[1].image,
    'cdnURL/url2.jpg',
    'Incorrect text'
  );
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
