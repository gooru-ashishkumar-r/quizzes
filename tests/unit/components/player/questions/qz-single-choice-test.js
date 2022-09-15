import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'player/questions/qz-single-choice',
  'Unit | Component | player/questions/qz single choice',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);

test('selectAnswerChoice on load', function(assert) {
  const component = this.subject();
  const expectedAnswerId = [{ value: 'answer' }];
  component.set('notifyAnswerChanged', function(answerId) {
    assert.deepEqual(
      answerId,
      expectedAnswerId,
      'Answer should match in answer changed'
    );
  });
  component.set('notifyAnswerLoaded', function(answerId) {
    assert.deepEqual(
      answerId,
      expectedAnswerId,
      'Answer should match in answer loaded'
    );
  });
  component.set('notifyAnswerLoaded', function() {
    assert.ok(false, 'Answer completed should not be called');
  });
  component.send('selectAnswerChoice', 'answer');
});
