import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
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
  'player/questions/qz-hs-image',
  'Unit | Component | player/questions/qz hs image',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true,
    beforeEach: function() {
      this.register('service:quizzes/configuration', configurationServiceStub);
      this.inject.service('quizzes/configuration');
    }
  }
);
test('answers', function(assert) {
  const component = this.subject();
  const question = ResourceModel.create({
    id: '569906aadfa0072204f7c7c7',
    type: QUESTION_TYPES.hotSpotImage,
    body: 'Hot spot image',
    answers: Ember.A([
      AnswerModel.create({
        value: '1',
        text: 'url.jpg'
      })
    ]),
    sequence: 1
  });
  component.set('question', question);
  assert.deepEqual(
    component.get('answers'),
    [{ value: '1', text: 'cdnURL/url.jpg' }],
    'Incorrect answers'
  );
});
