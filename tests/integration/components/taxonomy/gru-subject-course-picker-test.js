import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import TaxonomyRoot from 'quizzes-addon/models/taxonomy/taxonomy-root';
import TaxonomyItem from 'quizzes-addon/models/taxonomy/taxonomy-item';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';

moduleForComponent(
  'gru-subject-course-picker',
  'Integration | Component | taxonomy/gru subject course picker',
  {
    integration: true,
    beforeEach: function() {
      this.inject.service('i18n');
    }
  }
);

test('Show courses - no selection', function(assert) {
  const t1 = TaxonomyRoot.create({
    id: 'subject-1',
    frameworkId: 'framework-1',
    title: 'Subject 1',
    subjectTitle: 'Subject 1.1',
    code: 'subject-1-code',
    frameworks: []
  });

  const courses = [
    TaxonomyItem.create({
      id: 'course-1',
      code: 'course-1-code',
      title: 'Course 1'
    }),
    TaxonomyItem.create({
      id: 'course-2',
      code: 'course-2-code',
      title: 'Course 2'
    })
  ];

  this.set('selectedSubject', t1);
  this.set('courses', courses);

  this.render(hbs`{{taxonomy/gru-subject-course-picker
      selectedSubject=selectedSubject
      courses=courses
    }}`);

  const $component = this.$('.gru-subject-course-picker');
  assert.equal(
    $component.find('input[type=checkbox]').length,
    2,
    'Missing course checkboxes'
  );
  assert.equal(
    $component.find('input[type=checkbox]:checked').length,
    0,
    'No courses should be selected'
  );
});

test('Show courses - with selection', function(assert) {
  const t1 = TaxonomyRoot.create({
    id: 'subject-1',
    frameworkId: 'framework-1',
    title: 'Subject 1',
    subjectTitle: 'Subject 1.1',
    code: 'subject-1-code',
    frameworks: []
  });

  const courses = [
    TaxonomyItem.create({
      id: 'course-1',
      code: 'course-1-code',
      title: 'Course 1'
    }),
    TaxonomyItem.create({
      id: 'course-2',
      code: 'course-2-code',
      title: 'Course 2'
    })
  ];

  const selectedTaxonomy = Ember.A([
    TaxonomyTagData.create({
      id: 'course-1',
      code: 'course-1-code',
      title: 'Course 1',
      parentTitle: t1.get('subjectTitle'),
      frameworkCode: t1.get('frameworkId')
    })
  ]);

  this.set('selectedTaxonomy', selectedTaxonomy);
  this.set('selectedSubject', t1);
  this.set('courses', courses);

  this.render(hbs`{{taxonomy/gru-subject-course-picker
      selectedTaxonomy=selectedTaxonomy
      selectedSubject=selectedSubject
      courses=courses
    }}`);

  const $component = this.$('.gru-subject-course-picker');
  assert.equal(
    $component.find('input[type=checkbox]').length,
    2,
    'Missing course checkboxes'
  );
  assert.equal(
    $component.find('input[type=checkbox]:checked').length,
    1,
    'One course should be selected'
  );
});
