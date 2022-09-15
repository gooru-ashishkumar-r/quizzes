import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import AnswerModel from 'quizzes-addon/utils/question/answer-object';
import ResourceModel from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'reports/class-assessment/qz-question-information',
  'Integration | Component | reports/class assessment/qz question information',
  {
    integration: true
  }
);

test('Question Information With Narration Hints Explanation Media', function(assert) {
  const question = Ember.Object.create({
    id: '56a120483b6e7b090501d3e7',
    text: 'Resource 1',
    narration: 'this is a narration',
    mediaUrl:
      'http://qacdn.gooru.org/qalive//f000/2441/3253/9b5b8543-c8af-4f01-a76f-fa3a7e749636.JPG',
    hints: [
      {
        hintId: '98cdadb3-5ef4-4fad-92c5-3c09403ce5e6',
        hintText:
          '<p>Deserunt voluptate labore est sit nostrud ex et quis aliqua veniam deserunt ullamco.</p>',
        sequence: 1
      },
      {
        hintId: '21e07610-a788-4549-a57c-b79ab32b8909',
        hintText: '<p>Pariatur est excepteur est cupidatat.</p>',
        sequence: 2
      }
    ],
    explanation: 'explanation',
    hasNarration: true,
    hasMedia: true
  });
  this.set('question', question);

  this.render(
    hbs`{{reports/class-assessment/qz-question-information question=question}}`
  );

  const $component = this.$();
  const $questionInformation = $component.find('.qz-question-information');
  T.exists(
    assert,
    $questionInformation,
    'Missing question information component'
  );
  T.exists(
    assert,
    $questionInformation.find('.question'),
    'Question should be visible'
  );
  T.exists(
    assert,
    $questionInformation.find('.question h3'),
    'Missing Question Title'
  );
  T.exists(
    assert,
    $questionInformation.find('.question span'),
    'Missing Question Text'
  );
  T.exists(
    assert,
    $questionInformation.find('.question img'),
    'Missing Question Image'
  );
  T.exists(
    assert,
    $questionInformation.find('.hints'),
    'Hints should be visible'
  );
  assert.equal(
    $questionInformation.find('.hints span').length,
    question.hints.length,
    'Incorrect number of hints'
  );
  T.exists(
    assert,
    $questionInformation.find('.explanation'),
    'Explanation should be visible'
  );
  T.exists(
    assert,
    $questionInformation.find('.explanation span'),
    'Missing explanation'
  );
});

test('Question Information Without Narration Hints Explanation Media', function(assert) {
  const question = Ember.Object.create({
    id: '56a120483b6e7b090501d3e7',
    text: 'Resource 1',
    hasNarration: false,
    hasMedia: false
  });
  this.set('question', question);

  this.render(
    hbs`{{reports/class-assessment/qz-question-information question=question}}`
  );

  const $component = this.$();
  const $questionInformation = $component.find('.qz-question-information');
  T.notExists(
    assert,
    $questionInformation.find('.narration'),
    'Narration should be hidden'
  );
  T.notExists(
    assert,
    $questionInformation.find('.question img'),
    'Missing Question Image'
  );
  T.notExists(
    assert,
    $questionInformation.find('.hints'),
    'Hints should be hidden'
  );
  T.notExists(
    assert,
    $questionInformation.find('.explanation'),
    'Explanation should be hidden'
  );
});
test('Question Information Anonymous', function(assert) {
  const question = Ember.Object.create({
    id: '56a120483b6e7b090501d3e7',
    text: 'Resource 1',
    narration: 'this is a narration',
    mediaUrl:
      'http://qacdn.gooru.org/qalive//f000/2441/3253/9b5b8543-c8af-4f01-a76f-fa3a7e749636.JPG',
    hints: [
      {
        hintId: '98cdadb3-5ef4-4fad-92c5-3c09403ce5e6',
        hintText:
          '<p>Deserunt voluptate labore est sit nostrud ex et quis aliqua veniam deserunt ullamco.</p>',
        sequence: 1
      },
      {
        hintId: '21e07610-a788-4549-a57c-b79ab32b8909',
        hintText: '<p>Pariatur est excepteur est cupidatat.</p>',
        sequence: 2
      }
    ],
    explanation: 'explanation',
    hasNarration: true,
    hasMedia: true
  });
  const anonymous = true;
  this.set('question', question);
  this.set('anonymous', anonymous);

  this.render(
    hbs`{{reports/class-assessment/qz-question-information question=question anonymous=anonymous}}`
  );

  const $component = this.$();
  const $questionInformation = $component.find('.qz-question-information');
  T.notExists(
    assert,
    $questionInformation.find('.hints'),
    'Hints should not be visible'
  );
  T.notExists(
    assert,
    $questionInformation.find('.explanation'),
    'Explanation should not be visible'
  );
});

test('Question Information FIB text', function(assert) {
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

  this.render(
    hbs`{{reports/class-assessment/qz-question-information question=question}}`
  );

  const $component = this.$();
  const $questionInformation = $component.find('.qz-question-information');
  assert.equal(
    $questionInformation.find('.question .gru-math-text').text(),
    'The sun is _______ and the moon _______',
    'Incorrect text'
  );
});
