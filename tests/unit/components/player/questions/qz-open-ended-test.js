import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'player/questions/qz-open-ended',
  'Unit | Component | player/questions/qz open ended',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('notify on load', function(assert) {
  assert.expect(2);
  const expectedAnswerId = [{ value: 'answer' }];
  const component = this.subject({
    answer: 'answer',
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
    notifyAnswerCleared: () =>
      assert.ok(false, 'Answer cleared should not be called')
  });
  component.notify(true);
});

test('notify completion', function(assert) {
  assert.expect(2);
  const expectedAnswerId = [{ value: 'answer' }];
  const component = this.subject({
    answer: 'answer',
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
    notifyAnswerCleared: () =>
      assert.ok(false, 'Answer cleared should not be called')
  });
  component.notify(false);
});

test('notify clear', function(assert) {
  assert.expect(2);
  const expectedAnswerId = [{ value: '' }];
  const component = this.subject({
    answer: '',
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
    notifyAnswerCleared: answerId =>
      assert.deepEqual(
        answerId,
        expectedAnswerId,
        'Answer should match in answer cleared'
      )
  });
  component.notify(false);
});

test('isAnswerCompleted', function(assert) {
  assert.expect(2);
  const component = this.subject({
    answer: ''
  });
  assert.notOk(
    component.get('isAnswerCompleted'),
    'Is answer completed should be false'
  );
  component.set('answer', 'answer');
  assert.ok(
    component.get('isAnswerCompleted'),
    'Is answer completed should be true'
  );
});

test('charactersLeft', function(assert) {
  assert.expect(3);
  const component = this.subject({
    answer: '',
    maxLength: 6
  });
  assert.equal(
    component.get('charactersLeft'),
    6,
    'There should be 5 characters left'
  );
  component.set('answer', 'ans');
  assert.equal(
    component.get('charactersLeft'),
    3,
    'There should be 5 characters left'
  );
  component.set('answer', 'answer');
  assert.equal(
    component.get('charactersLeft'),
    0,
    'There should be 5 characters left'
  );
});
