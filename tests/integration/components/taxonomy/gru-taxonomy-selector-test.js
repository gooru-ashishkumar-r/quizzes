import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import T from 'dummy/tests/helpers/assert';
import TaxonomyRoot from 'quizzes-addon/models/taxonomy/taxonomy-root';
import TaxonomyItem from 'quizzes-addon/models/taxonomy/taxonomy-item';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';

const taxonomyServiceStub = Ember.Service.extend({
  getSubjects: function() {
    const t1 = TaxonomyRoot.create({
      id: 'subject.K12.1',
      frameworkId: 'framework-1',
      title: 'Subject 1',
      subjectTitle: 'Subject 1.1',
      code: 'subject.K12.1-code',
      frameworks: []
    });

    const t2 = TaxonomyRoot.create({
      id: 'subject-2',
      frameworkId: 'framework-2',
      title: 'Subject 2',
      subjectTitle: 'Subject 2.1',
      code: 'subject-2-code',
      frameworks: []
    });

    return new Ember.RSVP.resolve([t1, t2]);
  },

  getCourses: function(subject) {
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
    subject.set('courses', courses); //TODO the method should return the courses, not assign it to the parameter
    return new Ember.RSVP.resolve(courses);
  }
});

moduleForComponent(
  'gru-taxonomy-selector',
  'Integration | Component | taxonomy/gru taxonomy selector',
  {
    integration: true,
    beforeEach: function() {
      this.inject.service('i18n');

      this.register('service:taxonomy', taxonomyServiceStub);
      this.inject.service('taxonomy');
    }
  }
);

test('View mode it renders when no selection is made', function(assert) {
  this.render(hbs`{{taxonomy/gru-taxonomy-selector isEditing=false}}`);

  const $component = this.$('.gru-taxonomy-selector');

  assert.equal(
    $component.find('.categories .category').length,
    0,
    'There should be no category displayed'
  );
  assert.equal(
    $component.find('.subject .tags').length,
    0,
    'There should be no tags displayed'
  );
});

test('View mode it renders - no show categories', function(assert) {
  this.render(
    hbs`{{taxonomy/gru-taxonomy-selector isEditing=false showCategories=false}}`
  );

  const $component = this.$('.gru-taxonomy-selector');

  assert.equal(
    $component.find('.categories').length,
    0,
    'There should be no category displayed'
  );
});

test('Edit mode it renders when no selection is made', function(assert) {
  this.render(hbs`{{taxonomy/gru-taxonomy-selector isEditing=true}}`);

  const $component = this.$('.gru-taxonomy-selector');

  assert.equal(
    $component.find('.categories .btn-info').length,
    3,
    'There should be 3 non selected category buttons displayed'
  );
  assert.equal(
    $component.find('.subject .tags').length,
    0,
    'There should be no tags displayed'
  );
});

test('Edit mode category selection', function(assert) {
  assert.expect(8);
  this.on('selectCategory', function(category) {
    assert.equal(category, 'k_12', 'Wrong category');
  });

  this.render(
    hbs`{{taxonomy/gru-taxonomy-selector isEditing=true onCategorySelected='selectCategory'}}`
  );

  const $component = this.$('.gru-taxonomy-selector');

  assert.equal(
    $component.find('.categories .btn-info').length,
    3,
    'There should be 3 non selected category buttons displayed'
  );

  $component.find('.categories .btn-info:eq(0)').click();
  return wait().then(function() {
    assert.equal(
      $component.find('.categories .btn-info').length,
      2,
      'There should be 2 non selected category buttons displayed'
    );
    assert.equal(
      $component.find('.categories .btn-primary').length,
      1,
      'There should be 1 selected category button displayed'
    );

    const $subjectDropdown = $component.find('.gru-subject-picker');
    assert.equal($subjectDropdown.length, 1, 'Missing subject dropdown');
    assert.equal(
      $subjectDropdown.find('.selected-subject').length,
      1,
      'Missing select subject'
    );
    assert.equal(
      T.text($subjectDropdown.find('.selected-subject')),
      'Choose Subject',
      'Wrong selected subject title'
    );
    assert.equal(
      $subjectDropdown.find('li.subject').length,
      2,
      'Missing subjects'
    );
  });
});

/* TODO: DQ to fix this test
test('Edit mode subject selection with showCourses=false', function(assert) {
  assert.expect(5);
  this.on("selectCategory", function(category){
    assert.equal(category, "k_12", "Wrong category");
  });

  this.on("selectSubject", function(subject){
    assert.equal(subject.get("id"), "subject.K12.1", "Wrong subject");
  });

  this.render(hbs`{{taxonomy/gru-taxonomy-selector
      isEditing=true
      showCourses=false
      onCategorySelected='selectCategory'
      onSubjectSelected='selectSubject'
    }}`);

  const $component = this.$('.gru-taxonomy-selector');

  $component.find(".categories .btn-info:eq(0)").click();
  return wait().then(function () {
    const $subjectDropdown = $component.find(".gru-subject-picker");
    assert.equal($subjectDropdown.find("li.subject").length, 2, "Missing subjects");

    $subjectDropdown.find("li.subject a.subject-action:eq(0)").click();
    return wait().then(function () {
      assert.equal(T.text($subjectDropdown.find(".selected-subject")), 'framework-1 Subject 1.1', "Wrong selected subject title");
      assert.equal($component.find(".gru-subject-course-picker").length, 0, "Courses are turn off, it shouldn't be displayed");
    });
  });
});
*/

/* TODO: DQ to fix this test
test('Edit mode course selection', function(assert) {
  assert.expect(9);
  this.on("selectCategory", function(category){
    assert.equal(category, "k_12", "Wrong category");
  });

  this.on("selectSubject", function(subject){
    assert.equal(subject.get("id"), "subject.K12.1", "Wrong subject");
  });

  this.on("selectTaxonomy", function(taxonomy){
    assert.equal(taxonomy.get("length"), 1, "Wrong taxonomy");
  });

  this.render(hbs`{{taxonomy/gru-taxonomy-selector
      isEditing=true
      showCourses=true
      onCategorySelected='selectCategory'
      onSubjectSelected='selectSubject'
      onTaxonomySelected='selectTaxonomy'
    }}`);

  const $component = this.$('.gru-taxonomy-selector');


  $component.find(".categories .btn-info:eq(0)").click();
  return wait().then(function () {
    const $subjectDropdown = $component.find(".gru-subject-picker");
    assert.equal($subjectDropdown.find("li.subject").length, 2, "Missing subjects");

    $subjectDropdown.find("li.subject a.subject-action:eq(0)").click();
    return wait().then(function () {
      assert.equal(T.text($subjectDropdown.find(".selected-subject")), 'framework-1 Subject 1.1', "Wrong selected subject title");
      assert.equal($component.find(".subject .tags").length, 1, "Missing tags element");

      const $courses = $component.find(".gru-subject-course-picker");
      assert.equal($courses.length, 1, "Courses are turn on, it should be displayed");
      assert.equal($courses.find("input[type=checkbox]").length, 2, "Missing course checkboxes");

      $courses.find("input[type=checkbox]:eq(0)").click();
      return wait().then(function () {
        assert.equal($component.find(".subject .tags .gru-taxonomy-tag").length, 1, "There should be 1 tags displayed");
      });
    });
  });
});
*/

test('View mode with selection', function(assert) {
  const t1 = TaxonomyRoot.create({
    id: 'subject.K12.1',
    frameworkId: 'framework-1',
    title: 'Subject 1',
    subjectTitle: 'Subject 1.1',
    code: 'subject.K12.1-code',
    frameworks: []
  });

  const selectedTaxonomy = Ember.A([
    TaxonomyTagData.create({
      id: 'course-1',
      code: 'course-1-code',
      title: 'Course 1',
      parentTitle: t1.get('subjectTitle'),
      frameworkCode: t1.get('frameworkId')
    })
  ]);

  this.set('selectedSubject', t1);
  this.set('selectedTaxonomy', selectedTaxonomy);

  this.render(hbs`{{taxonomy/gru-taxonomy-selector
      isEditing=false
      showCourses=true
      selectedSubject=selectedSubject
      selectedTaxonomy=selectedTaxonomy
    }}`);

  const $component = this.$('.gru-taxonomy-selector');
  assert.equal(
    $component.find('.categories .category').length,
    1,
    'There should be category displayed'
  );
  assert.equal(
    $component.find('.subject .tags .gru-taxonomy-tag-list > .gru-taxonomy-tag')
      .length,
    1,
    'Number of tags rendered'
  );
});

/* TODO: DQ to fix this test
test('Edit mode with selection', function(assert) {
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

  const t1 = TaxonomyRoot.create({
    id: "subject.K12.1",
    frameworkId: "framework-1",
    title: "Subject 1",
    subjectTitle: "Subject 1.1",
    code: "subject.K12.1-code",
    frameworks: [],
    courses: courses
  });

  const selectedTaxonomy = Ember.A([
    TaxonomyTagData.create({
      id: 'course-1',
      code: 'course-1-code',
      title: 'Course 1',
      parentTitle: t1.get('subjectTitle'),
      frameworkCode: t1.get('frameworkId')
    })
  ]);

  this.set("selectedSubject", t1);
  this.set("selectedTaxonomy", selectedTaxonomy);

  this.render(hbs`{{taxonomy/gru-taxonomy-selector
      isEditing=true
      showCourses=true
      selectedSubject=selectedSubject
      selectedTaxonomy=selectedTaxonomy
    }}`);

  const $component = this.$('.gru-taxonomy-selector');
  return wait().then(function(){
    assert.equal($component.find(".subject .tags .gru-taxonomy-tag").length, 1, "There should be 1 tags displayed");

    assert.equal($component.find(".categories .btn-info").length, 2, "There should be 2 non selected category buttons displayed");
    assert.equal($component.find(".categories .btn-primary").length, 1, "There should be 1 selected category button displayed");

    const $subjectDropdown = $component.find(".gru-subject-picker");
    assert.equal($subjectDropdown.find("li.subject").length, 2, "Missing subjects");

    assert.equal(T.text($subjectDropdown.find(".selected-subject")), 'framework-1 Subject 1.1', "Wrong selected subject title");

    const $courses = $component.find(".gru-subject-course-picker");
    assert.equal($courses.length, 1, "Courses are turn on, it should be displayed");
    assert.equal($courses.find("input[type=checkbox]").length, 2, "Missing course checkboxes");
    assert.equal($courses.find("input[type=checkbox]:checked").length, 1, "One course checkbox should be checked");

  });

});
*/
