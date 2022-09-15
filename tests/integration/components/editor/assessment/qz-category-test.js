import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import Category from 'quizzes-addon/models/editor/assessment/category';

moduleForComponent(
  'editor/assessment/qz-category',
  'Integration | Component | editor/assessment/qz category',
  {
    integration: true
  }
);

test('Category Layout', function(assert) {
  var category = Ember.Object.create({
    title: 'Category for test',
    feedbackGuidance: 'Guidance for test',
    requiredFeedback: false
  });
  this.set('category', category);
  this.render(hbs`{{editor/assessment/qz-category category=category}}`);
  var $component = this.$();
  assert.ok(
    $component.find('.editor.assessment.qz-category').length,
    'Category component missing'
  );
  assert.ok(
    $component.find('.editor.assessment.qz-category .panel.category').length,
    'Missing category panel'
  );
  assert.ok(
    $component.find('.editor.assessment.qz-category .panel.category .number')
      .length,
    'Missing category number'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-category .panel.category .category-info'
    ).length,
    'Missing category information'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-category .panel.category .category-info .title'
    ).length,
    'Missing category title'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-category .panel.category .category-info .feedback-guidance'
    ).length,
    'Missing feedback guidance'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-category .panel.category .category-info .required-feedback'
    ).length,
    'Missing required feedback checkbox'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-category .panel.category .category-info .scoring'
    ).length,
    'Missing scoring switch'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-category .panel-footer .actions .btn.delete'
    ).length,
    'Missing delete category button'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-category .panel-footer .actions .btn.copy'
    ).length,
    'Missing copy category button'
  );
});

test('Delete Category', function(assert) {
  assert.expect(1);

  let categoryDelete = Ember.Object.create({
    title: 'Category for test',
    feedbackGuidance: 'Guidance for test',
    requiredFeedback: false
  });
  this.on('parentAction', function(category) {
    assert.ok(categoryDelete, category);
  });

  this.set('category', categoryDelete);
  this.render(
    hbs`{{editor/assessment/qz-category category=categoryDelete onDeleteCategory='parentAction'}}`
  );

  var $component = this.$(); //component dom element
  var $delete = $component.find('.btn.delete');
  $delete.click();
});

test('Copy Category', function(assert) {
  assert.expect(1);

  let categoryCopy = Category.create({
    title: 'Category for test',
    feedbackGuidance: 'Guidance for test',
    requiredFeedback: false
  });
  this.on('parentAction', function(category) {
    assert.ok(categoryCopy, category);
  });

  this.set('category', categoryCopy);
  this.render(
    hbs`{{editor/assessment/qz-category category=categoryCopy onCopyCategory='parentAction'}}`
  );

  var $component = this.$(); //component dom element
  var $copy = $component.find('.btn.copy');
  $copy.click();
});
