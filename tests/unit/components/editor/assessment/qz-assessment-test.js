import { moduleForComponent, test } from 'ember-qunit';
import Category from 'quizzes-addon/models/editor/assessment/category';
import Ember from 'ember';

moduleForComponent(
  'editor/assessment/qz-assessment',
  'Unit | Component | editor/assessment/qz assessment',
  {
    unit: true
  }
);

test('addNewCategory', function(assert) {
  const component = this.subject();
  assert.equal(
    component.get('categories.length'),
    0,
    'Should not have categories'
  );
  component.send('addNewCategory');
  assert.equal(component.get('categories.length'), 1, 'Should have 1 category');
});

test('setFeedBack', function(assert) {
  const component = this.subject();
  assert.equal(
    component.get('assessment.requiredFeedback'),
    false,
    'Feedback is not required'
  );
  component.send('setFeedBack');
  assert.equal(
    component.get('assessment.requiredFeedback'),
    true,
    'Feedback is not required'
  );
});

test('deleteCategory', function(assert) {
  const component = this.subject();
  component.set(
    'categories',
    Ember.A([Category.create({ title: 'category-test' })])
  );
  assert.equal(
    component.get('categories.length'),
    1,
    'Should have one category'
  );
  component.send('addNewCategory');
  assert.equal(
    component.get('categories.length'),
    2,
    'Should have 2 categories'
  );
  component.send('deleteCategory', component.get('categories')[1]);
  assert.equal(component.get('categories.length'), 1, 'Should have 1 category');
});

test('copyCategory', function(assert) {
  const component = this.subject();
  const category = Category.create({ title: 'category-test' });
  component.set(
    'categories',
    Ember.A([Category.create({ title: 'category-test' })])
  );
  component.send('copyCategory', category, 0);
  assert.equal(
    component.get('categories')[1].get('title'),
    category.get('title'),
    'The category should be copy'
  );
});
