import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import TaxonomyRoot from 'quizzes-addon/models/taxonomy/taxonomy-root';

moduleForComponent(
  'gru-subject-picker',
  'Integration | Component | taxonomy/gru subject picker',
  {
    integration: true,
    beforeEach: function() {
      this.inject.service('i18n');
    }
  }
);

test('Show subjects - no selection', function(assert) {
  assert.expect(5);
  const t1 = TaxonomyRoot.create({
    id: 'subject-1',
    frameworkId: 'framework-1',
    title: 'Subject 1',
    subjectTitle: 'Subject 1.1',
    code: 'subject-1-code',
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

  this.on('selectSubject', function(subject) {
    assert.equal(subject.get('id'), 'subject-1', 'Wrong subject');
  });

  this.set('subjects', [t1, t2]);

  this.render(hbs`{{taxonomy/gru-subject-picker
      subjects=subjects
      onSubjectSelected='selectSubject'
    }}`);

  const $component = this.$('.gru-subject-picker');

  assert.equal($component.length, 1, 'Missing subject dropdown');
  assert.equal(
    $component.find('.selected-subject').length,
    1,
    'Missing select subject'
  );
  assert.equal(
    T.text($component.find('.selected-subject')),
    'Choose Subject',
    'Wrong selected subject title'
  );
  assert.equal($component.find('li.subject').length, 2, 'Missing subjects');

  $component.find('li.subject a.subject-action:eq(0)').click();
});

/* TODO: DQ to fix this test
test('Show subjects - with selection', function(assert) {
  assert.expect(6);
  const t1 = TaxonomyRoot.create({
    id: "subject-1",
    frameworkId: "framework-1",
    title: "Subject 1",
    subjectTitle: "Subject 1.1",
    code: "subject-1-code",
    frameworks: []
  });

  const t2 = TaxonomyRoot.create({
    id: "subject-2",
    frameworkId: "framework-2",
    title: "Subject 2",
    subjectTitle: "Subject 2.1",
    code: "subject-2-code",
    frameworks: []
  });

  this.on("selectSubject", function(subject){
    assert.equal(subject.get("id"), "subject-2", "Wrong subject");
  });

  this.set("subjects", [t1, t2]);
  this.set("selectedSubject", t1);

  this.render(hbs`{{taxonomy/gru-subject-picker
      selectedSubject=selectedSubject
      subjects=subjects
      onSubjectSelected='selectSubject'
    }}`);

  const $component = this.$('.gru-subject-picker');

  assert.equal($component.length, 1, "Missing subject dropdown");
  assert.equal($component.find(".selected-subject").length, 1, "Missing select subject");
  assert.equal(T.text($component.find(".selected-subject")), 'framework-1 Subject 1.1', "Wrong selected subject title");
  assert.equal($component.find("li.subject").length, 2, "Missing subjects");

  $component.find("li.subject a.subject-action:eq(1)").click();
  return wait().then(function(){
    assert.equal(T.text($component.find(".selected-subject")), 'framework-2 Subject 2.1', "Wrong selected subject title");
  });
});
*/
