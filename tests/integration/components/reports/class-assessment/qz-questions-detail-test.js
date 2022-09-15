import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Collection from 'quizzes-addon/models/collection/collection';
import Answer from 'quizzes-addon/models/resource/answer';
import Resource from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';
import ReportData from 'quizzes-addon/models/result/report-data';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'reports/class-assessment/qz-questions-detail',
  'Integration | Component | reports/class assessment/qz questions detail',
  {
    integration: true
  }
);

test('Layout', function(assert) {
  const selectedQuestion = Resource.create({
    //Single Choice
    id: '56b120483b6e7b090501d3e7',
    isResource: false,
    type: QUESTION_TYPES.singleChoice,
    body: 'Sample Question SC',
    answers: Ember.A([
      Answer.create({ value: 1, text: 'Answer 1' }),
      Answer.create({ value: 2, text: 'Answer 2' }),
      Answer.create({ value: 3, text: 'Answer 3' })
    ]),
    sequence: 1
  });

  const assessment = Collection.create({
    resources: [
      selectedQuestion,
      Resource.create({
        //Single Choice
        id: '56a1204886b2e565e1b2c230',
        isResource: false,
        type: QUESTION_TYPES.singleChoice,
        body: 'Sample Question SC',
        answers: Ember.A([
          Answer.create({ value: 1, text: 'Answer 1' }),
          Answer.create({ value: 2, text: 'Answer 2' }),
          Answer.create({ value: 3, text: 'Answer 3' })
        ]),
        sequence: 2
      }),
      Resource.create({
        //Single Choice
        id: '56a12048ddee2022a741356a',
        isResource: false,
        type: QUESTION_TYPES.trueFalse,
        body: 'True False Question',
        answers: Ember.A([
          Answer.create({ value: '1', text: 'True' }),
          Answer.create({ value: '2', text: 'False' })
        ]),
        sequence: 3
      })
    ]
  });

  const reportData = ReportData.create({
    collection: assessment,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            answer: 'True'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            answer: 'True'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            answer: 'True'
          })
        ])
      })
    ]
  });

  const model = Ember.Object.create({
    selectedQuestion,
    reportData
  });

  this.set('model', model);

  this.render(
    hbs`{{reports/class-assessment/qz-questions-detail model=model }}`
  );

  const $component = this.$();
  const $navigation = $component.find('.navigation');
  T.exists(assert, $navigation, 'Missing navigation');
  T.exists(
    assert,
    $navigation.find('.gru-bubbles'),
    'Missing navigation bubbles'
  );
  assert.equal(
    $navigation.find('.gru-bubbles .bubble').length,
    3,
    'Wrong number of questions'
  );
  assert.equal(
    $navigation.find('.gru-bubbles .bubble:eq(1)').text(),
    '2',
    'Wrong question number for second question'
  );

  assert.ok(
    $navigation.find('.gru-bubbles .bubble:eq(0)').hasClass('selected'),
    'First question should be selected'
  );

  T.exists(
    assert,
    $component.find('.body .question-info'),
    'Missing question information panel'
  );
  T.exists(
    assert,
    $component.find('.body .question-info .qz-question-information'),
    'Missing question information component'
  );
  T.exists(
    assert,
    $component.find('.body .question-metrics'),
    'Missing question metrics panel'
  );
  T.exists(
    assert,
    $component.find('.body .question-metrics .qz-question-performance'),
    'Missing question performance component'
  );
});

test('Layout Anonymous', function(assert) {
  const selectedQuestion = Resource.create({
    //Single Choice
    id: '56b120483b6e7b090501d3e7',
    isResource: false,
    type: QUESTION_TYPES.singleChoice,
    body: 'Sample Question SC',
    answers: Ember.A([
      Answer.create({ value: 1, text: 'Answer 1' }),
      Answer.create({ value: 2, text: 'Answer 2' }),
      Answer.create({ value: 3, text: 'Answer 3' })
    ]),
    sequence: 1
  });

  const assessment = Collection.create({
    resources: [
      selectedQuestion,
      Resource.create({
        //Single Choice
        id: '56a1204886b2e565e1b2c230',
        isResource: false,
        type: QUESTION_TYPES.singleChoice,
        body: 'Sample Question SC',
        answers: Ember.A([
          Answer.create({ value: 1, text: 'Answer 1' }),
          Answer.create({ value: 2, text: 'Answer 2' }),
          Answer.create({ value: 3, text: 'Answer 3' })
        ]),
        sequence: 2
      }),
      Resource.create({
        //Single Choice
        id: '56a12048ddee2022a741356a',
        isResource: false,
        type: QUESTION_TYPES.trueFalse,
        body: 'True False Question',
        answers: Ember.A([
          Answer.create({ value: '1', text: 'True' }),
          Answer.create({ value: '2', text: 'False' })
        ]),
        sequence: 3
      })
    ]
  });

  const reportData = ReportData.create({
    collection: assessment,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            answer: 'True'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            answer: 'True'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            answer: 'True'
          })
        ])
      })
    ]
  });

  const model = Ember.Object.create({
    selectedQuestion,
    reportData,
    anonymous: true
  });

  this.set('model', model);

  this.render(
    hbs`{{reports/class-assessment/qz-questions-detail model=model}}`
  );

  const $component = this.$();
  const $navigation = $component.find('.navigation');
  T.exists(
    assert,
    $navigation.find('.btn-results'),
    'Missing Show Results Button'
  );
});

test('Layout Anonymous and Show Results', function(assert) {
  const selectedQuestion = Resource.create({
    //Single Choice
    id: '56b120483b6e7b090501d3e7',
    isResource: false,
    type: QUESTION_TYPES.singleChoice,
    body: 'Sample Question SC',
    answers: Ember.A([
      Answer.create({ value: 1, text: 'Answer 1' }),
      Answer.create({ value: 2, text: 'Answer 2' }),
      Answer.create({ value: 3, text: 'Answer 3' })
    ]),
    sequence: 1
  });

  const assessment = Collection.create({
    resources: [
      selectedQuestion,
      Resource.create({
        //Single Choice
        id: '56a1204886b2e565e1b2c230',
        isResource: false,
        type: QUESTION_TYPES.singleChoice,
        body: 'Sample Question SC',
        answers: Ember.A([
          Answer.create({ value: 1, text: 'Answer 1' }),
          Answer.create({ value: 2, text: 'Answer 2' }),
          Answer.create({ value: 3, text: 'Answer 3' })
        ]),
        sequence: 2
      }),
      Resource.create({
        //Single Choice
        id: '56a12048ddee2022a741356a',
        isResource: false,
        type: QUESTION_TYPES.trueFalse,
        body: 'True False Question',
        answers: Ember.A([
          Answer.create({ value: '1', text: 'True' }),
          Answer.create({ value: '2', text: 'False' })
        ]),
        sequence: 3
      })
    ]
  });

  const reportData = ReportData.create({
    collection: assessment,
    reportEvents: [
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            answer: 'True'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            answer: 'True'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            answer: 'answer'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            answer: 'True'
          })
        ])
      })
    ]
  });

  const model = Ember.Object.create({
    selectedQuestion,
    reportData,
    anonymous: true
  });

  const showResult = true;

  this.set('model', model);
  this.set('showResult', showResult);

  this.render(
    hbs`{{reports/class-assessment/qz-questions-detail model=model showResult=showResult}}`
  );

  const $component = this.$();
  const $navigation = $component.find('.navigation');
  assert.equal(
    T.text($navigation.find('.btn-results')),
    'Hide Results',
    'Incorrect button'
  );
});
