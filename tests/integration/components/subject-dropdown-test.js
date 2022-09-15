import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'subject-dropdown',
  'Integration | Component | subject dropdown',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Layout using defaults', function(assert) {
  assert.expect(14);

  const subjects = Ember.A();
  subjects.addObject(
    Ember.Object.create({
      libraryId: 1,
      library: 'library',
      label: 'Math',
      subjectCode: '10001'
    })
  );
  subjects.addObject(
    Ember.Object.create({
      libraryId: 2,
      library: 'library',
      label: 'Science',
      subjectCode: '10002'
    })
  );
  subjects.addObject(
    Ember.Object.create({
      libraryId: 3,
      library: 'library',
      label: 'History',
      subjectCode: '10003'
    })
  );
  subjects.addObject(
    Ember.Object.create({
      libraryId: 4,
      library: 'library',
      label: 'Language',
      subjectCode: '10004'
    })
  );

  this.set('testSubjects', subjects);

  this.render(hbs`{{subject-dropdown subjects=testSubjects}}`);

  const $component = this.$(),
    $dropdown = $component.find('.subject-dropdown');

  T.exists(assert, $dropdown, 'Missing subject-dropdown');

  //button group
  const $buttonGroup = $dropdown.find('.btn-group');
  T.exists(assert, $buttonGroup, 'Missing btn-group');
  assert.ok(
    $buttonGroup.hasClass('btn-group-lg'),
    'Missing default btn group size class'
  );
  assert.ok(
    $buttonGroup.hasClass('keep-open-yes'),
    'Missing keep-open-yes class'
  );
  T.exists(
    assert,
    $buttonGroup.find('.selected-text'),
    'Missing select text button'
  );
  assert.equal(
    T.text($buttonGroup.find('.selected-text')),
    'subject(s)',
    'Wrong default selected text'
  );
  assert.equal(
    $buttonGroup.find('.btn.btn-primary').length,
    2,
    'Missing default btn-primary class'
  );

  //Dropdown menu
  const $dropdownMenu = $dropdown.find('.dropdown-menu');
  T.exists(assert, $dropdownMenu, 'Missing dropdown menu');
  T.exists(
    assert,
    $dropdownMenu.find('.dropdown-header'),
    'Dropdown header should exists'
  );
  assert.equal(
    T.text($dropdownMenu.find('.dropdown-header')),
    'Select a subject',
    'Wrong item text'
  );
  assert.equal(
    $dropdownMenu.find('li a.item').length,
    4,
    'Missing anchor with item class'
  );
  assert.equal(
    T.text($dropdownMenu.find('li a.item:eq(0)')),
    'Math',
    'Wrong item text'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li.disabled'),
    'Disabled items should not exists'
  );
  T.notExists(
    assert,
    $dropdownMenu.find('li.selected'),
    'Selected items should not exists'
  );
});
