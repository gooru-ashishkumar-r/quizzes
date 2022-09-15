import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'editor/assessment/qz-category',
  'Unit | Component | editor/assessment/qz category',
  {
    unit: true
  }
);

test('setFeedBack', function(assert) {
  const component = this.subject();
  assert.equal(
    component.get('category.requiredFeedback'),
    false,
    'Feedback is not required'
  );
  component.send('setFeedBack');
  assert.equal(
    component.get('category.requiredFeedback'),
    true,
    'Feedback is should be required'
  );
});

test('onScoringChange', function(assert) {
  const component = this.subject();
  assert.equal(component.get('showScore'), false, 'Should not show score');
  component.send('onScoringChange', true);
  assert.equal(component.get('showScore'), true, 'Should show the score');
});

test('deleteCategory', function(assert) {
  const component = this.subject();
  const categoryDelete = { id: 'category-test' };
  component.set('sendAction', function(actionName, category) {
    assert.equal(actionName, 'onDeleteCategory', 'Action sent should match');
    assert.equal(category, categoryDelete, 'Category should match');
  });
  component.send('deleteCategory', categoryDelete);
});

test('copyCategory', function(assert) {
  const component = this.subject();
  const categoryCopy = { id: 'category-test' };
  component.set('sendAction', function(actionName, category, index) {
    assert.equal(actionName, 'onCopyCategory', 'Action sent should match');
    assert.equal(category, categoryCopy, 'Category should match');
    assert.equal(index, 1, 'Index should match');
  });
  component.send('copyCategory', categoryCopy, 1);
});
