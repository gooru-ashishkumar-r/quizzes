import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import AnswerModel from 'quizzes-addon/models/resource/answer';
import ResourceModel from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'player/questions/qz-multiple-answer',
  'Unit | Component | player/questions/qz multiple answer',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('selectAnswerChoice on load', function(assert) {
  assert.expect(2);
  let expectedAnswerId = [{ value: 'answer' }];
  const component = this.subject({
    notifyAnswerChanged: answerId =>
      assert.deepEqual(
        answerId,
        expectedAnswerId,
        'Answer should match in answer changed'
      ),
    notifyAnswerLoaded: answerId =>
      assert.deepEqual(
        answerId,
        expectedAnswerId,
        'Answer should match in answer loaded'
      ),
    notifyAnswerCompleted: () =>
      assert.ok(false, 'Answer completed should not be called')
  });
  component.send('selectAnswerChoice', 'yes|answer');
  expectedAnswerId = [];
  component.send('selectAnswerChoice', 'no|answer');
});

test('answers', function(assert) {
  const component = this.subject({
    question: ResourceModel.create({
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'text1' }),
        AnswerModel.create({ value: '2', text: 'text2' }),
        AnswerModel.create({ value: '3', text: 'text3' })
      ])
    })
  });
  let expectedAnswers = [
    {
      value: '1',
      text: 'text1',
      groupValue: null
    },
    {
      value: '2',
      text: 'text2',
      groupValue: null
    },
    {
      value: '3',
      text: 'text3',
      groupValue: null
    }
  ];
  assert.deepEqual(
    component.get('answers'),
    expectedAnswers,
    'Answers should match'
  );

  component.set(
    'userSelection',
    Ember.A([
      { value: '1', selection: true },
      { value: '2', selection: false },
      { value: '3', selection: false }
    ])
  );
  expectedAnswers = [
    {
      value: '1',
      text: 'text1',
      groupValue: 'yes|1'
    },
    {
      value: '2',
      text: 'text2',
      groupValue: 'no|2'
    },
    {
      value: '3',
      text: 'text3',
      groupValue: 'no|3'
    }
  ];
  assert.deepEqual(
    component.get('answers'),
    expectedAnswers,
    'Answers should match'
  );
});

test('userSelection with empty user answer', function(assert) {
  assert.expect(1);
  const component = this.subject({
    userAnswer: [],
    question: ResourceModel.create({
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'text1' }),
        AnswerModel.create({ value: '2', text: 'text2' }),
        AnswerModel.create({ value: '3', text: 'text3' })
      ])
    })
  });
  const expectedUserSelection = [
    { value: '1', selection: false },
    { value: '2', selection: false },
    { value: '3', selection: false }
  ];
  assert.deepEqual(
    component.get('userSelection'),
    expectedUserSelection,
    'User selection should match'
  );
});

test('userSelection with no user answer', function(assert) {
  assert.expect(1);
  const component = this.subject({
    question: ResourceModel.create({
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'text1' }),
        AnswerModel.create({ value: '2', text: 'text2' }),
        AnswerModel.create({ value: '3', text: 'text3' })
      ])
    })
  });
  assert.deepEqual(
    component.get('userSelection'),
    [],
    'User selection should match'
  );
});

test('userSelection with user answer', function(assert) {
  assert.expect(1);
  const component = this.subject({
    userAnswer: [{ value: '2' }, { value: '3' }],
    question: ResourceModel.create({
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'text1' }),
        AnswerModel.create({ value: '2', text: 'text2' }),
        AnswerModel.create({ value: '3', text: 'text3' })
      ])
    })
  });
  const expectedUserSelection = [
    { value: '1', selection: false },
    { value: '2', selection: true },
    { value: '3', selection: true }
  ];
  assert.deepEqual(
    component.get('userSelection'),
    expectedUserSelection,
    'User selection should match'
  );
});

test('isAnswerCompleted not complete', function(assert) {
  assert.expect(1);
  const component = this.subject({
    question: ResourceModel.create({
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'text1' }),
        AnswerModel.create({ value: '2', text: 'text2' }),
        AnswerModel.create({ value: '3', text: 'text3' })
      ])
    })
  });
  assert.notOk(
    component.get('isAnswerCompleted').call(component),
    'Answer should not be completed'
  );
});

test('isAnswerCompleted complete', function(assert) {
  assert.expect(1);
  const component = this.subject({
    userAnswer: [],
    question: ResourceModel.create({
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'text1' }),
        AnswerModel.create({ value: '2', text: 'text2' }),
        AnswerModel.create({ value: '3', text: 'text3' })
      ])
    })
  });
  assert.ok(
    component.get('isAnswerCompleted').call(component),
    'Answer should be completed'
  );
});

test('choiceToUserSelectionItem', function(assert) {
  assert.expect(1);
  const component = this.subject();
  const expectedUserSelection = { value: 'answer', selection: true };
  const response = component.get('choiceToUserSelectionItem')('yes|answer');
  assert.deepEqual(
    response,
    expectedUserSelection,
    'User selection should match'
  );
});

test('userSelectionItemToChoice', function(assert) {
  assert.expect(1);
  const component = this.subject();
  const selection = { value: 'answer', selection: false };
  const response = component.get('userSelectionItemToChoice')(selection);
  const expectedValue = 'no|answer';
  assert.deepEqual(response, expectedValue, 'User selection should match');
});

test('setUserAnswerChoice', function(assert) {
  assert.expect(2);
  const component = this.subject();
  let expectedUserSelection = [
    {
      value: 'answer',
      selection: true
    }
  ];
  component.get('setUserAnswerChoice').call(component, 'yes|answer');
  assert.deepEqual(
    component.get('userSelection'),
    expectedUserSelection,
    'User selection should match'
  );

  component.get('setUserAnswerChoice').call(component, 'no|answer');
  expectedUserSelection = [
    {
      value: 'answer',
      selection: false
    }
  ];
  assert.deepEqual(
    component.get('userSelection'),
    expectedUserSelection,
    'User selection should match'
  );
});

test('notify not completed', function(assert) {
  assert.expect(1);
  const expectedAnswerId = [{ value: 'answer' }];
  const component = this.subject({
    notifyAnswerChanged: answerId =>
      assert.deepEqual(
        answerId,
        expectedAnswerId,
        'Answer should match in answer changed'
      ),
    notifyAnswerLoaded: () =>
      assert.ok(false, 'Answer loaded should not be called'),
    notifyAnswerCompleted: () =>
      assert.ok(false, 'Answer completed should not be called'),
    question: ResourceModel.create({
      answers: Ember.A([
        AnswerModel.create({ value: '1', text: 'text1' }),
        AnswerModel.create({ value: '2', text: 'text2' }),
        AnswerModel.create({ value: '3', text: 'text3' })
      ])
    })
  });
  component.set('userSelection', [
    {
      value: 'answer',
      selection: true
    }
  ]);
  component.get('notify').call(component);
});

test('notify completed on load', function(assert) {
  assert.expect(2);
  const expectedAnswerId = [{ value: 'answer' }];
  const component = this.subject({
    notifyAnswerChanged: answerId =>
      assert.deepEqual(
        answerId,
        expectedAnswerId,
        'Answer should match in answer changed'
      ),
    notifyAnswerLoaded: answerId =>
      assert.deepEqual(
        answerId,
        expectedAnswerId,
        'Answer should match in answer loaded'
      ),
    notifyAnswerCompleted: () =>
      assert.ok(false, 'Answer completed should not be called'),
    question: ResourceModel.create({
      answers: Ember.A([AnswerModel.create({ value: 'answer', text: 'text1' })])
    })
  });
  component.set('userSelection', [
    {
      value: 'answer',
      selection: true
    }
  ]);
  component.get('notify').call(component, true);
});

test('notify completed not on load', function(assert) {
  assert.expect(2);
  const expectedAnswerId = [{ value: 'answer' }];
  const component = this.subject({
    notifyAnswerChanged: answerId =>
      assert.deepEqual(
        answerId,
        expectedAnswerId,
        'Answer should match in answer changed'
      ),
    notifyAnswerLoaded: () =>
      assert.ok(false, 'Answer loaded should not be called'),
    notifyAnswerCompleted: answerId =>
      assert.deepEqual(
        answerId,
        expectedAnswerId,
        'Answer should match in answer completed'
      ),
    question: ResourceModel.create({
      answers: Ember.A([AnswerModel.create({ value: 'answer', text: 'text1' })])
    })
  });
  component.set('userSelection', [
    {
      value: 'answer',
      selection: true
    }
  ]);
  component.get('notify').call(component);
});
