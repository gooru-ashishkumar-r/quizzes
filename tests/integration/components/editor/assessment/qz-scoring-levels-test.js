import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Level from 'quizzes-addon/models/editor/assessment/level';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

moduleForComponent(
  'editor/assessment/qz-scoring-levels',
  'Integration | Component | editor/assessment/qz scoring levels',
  {
    integration: true
  }
);

test('Scoring Level Layout', function(assert) {
  const scoringLevels = Ember.A([
    Level.create({
      id: 'exemplary'
    }),
    Level.create({
      id: 'proficient'
    }),
    Level.create({
      id: 'basic'
    }),
    Level.create({
      id: 'below-basic'
    })
  ]);
  this.set('scoringLevels', scoringLevels);

  this.render(
    hbs`{{editor/assessment/qz-scoring-levels scoringLevels=scoringLevels}}`
  );
  var $component = this.$();
  assert.ok(
    $component.find('.editor.assessment.qz-scoring-levels').length,
    'Missing scoring levels component'
  );
  assert.ok(
    $component.find('.editor.assessment.qz-scoring-levels .level span').length,
    'Missing levels title'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-scoring-levels .level .levels .scale'
    ).length,
    'Missing scale'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-scoring-levels .level .levels .scale span.best'
    ).length,
    'Missing best label'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-scoring-levels .level .levels .scale .line'
    ).length,
    'Missing line'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-scoring-levels .level .levels .scale .arrow-down'
    ).length,
    'Missing arrow'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-scoring-levels .level .levels .scale .worst'
    ).length,
    'Missing worst label'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-scoring-levels .level .levels .scale .worst'
    ).length,
    'Missing worst label'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-scoring-levels .level .levels .level-list'
    ).length,
    'Missing level list'
  );
  assert.equal(
    $component.find(
      '.editor.assessment.qz-scoring-levels .level .levels .level-list .gru-input'
    ).length,
    4,
    'Should have 4 levels'
  );
  assert.ok(
    $component.find(
      '.editor.assessment.qz-scoring-levels .level .btn-new-level'
    ).length,
    'Missing add new level button'
  );
  assert.ok(
    $component.find('.editor.assessment.qz-scoring-levels .points').length,
    'Missing points section'
  );
  assert.ok(
    $component.find('.editor.assessment.qz-scoring-levels .points span').length,
    'Missing points title'
  );
  assert.ok(
    $component.find('.editor.assessment.qz-scoring-levels .points .point-list')
      .length,
    'Missing points list'
  );
  assert.equal(
    $component.find(
      '.editor.assessment.qz-scoring-levels .points .point-list .gru-input'
    ).length,
    4,
    'Should have 4 point inputs'
  );
});

test('Delete Scoring Level', function(assert) {
  const scoringLevels = Ember.A([
    Level.create({
      id: 'exemplary'
    }),
    Level.create({
      id: 'proficient'
    }),
    Level.create({
      id: 'basic'
    }),
    Level.create({
      id: 'below-basic'
    })
  ]);
  this.set('scoringLevels', scoringLevels);

  this.render(
    hbs`{{editor/assessment/qz-scoring-levels scoringLevels=scoringLevels}}`
  );
  var $component = this.$();
  assert.ok(
    $component.find('.editor.assessment.qz-scoring-levels').length,
    'Missing scoring levels component'
  );
  assert.equal(
    $component.find(
      '.editor.assessment.qz-scoring-levels .points .point-list .btn.delete'
    ).length,
    4,
    'Should have 4 delete buttons'
  );
  var $firstLevelDeleteBtn = $component.find(
    '.editor.assessment.qz-scoring-levels .points .point-list div:eq(0) .btn.delete'
  );
  $firstLevelDeleteBtn.click();
  return wait().then(function() {
    assert.equal(
      $component.find(
        '.editor.assessment.qz-scoring-levels .points .point-list .gru-input'
      ).length,
      3,
      'Should have 3 levels'
    );
  });
});
