import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import Level from 'quizzes-addon/models/editor/assessment/level';

moduleForComponent(
  'editor/assessment/qz-scoring-levels',
  'Unit | Component | editor/assessment/qz scoring levels',
  {
    unit: true
  }
);

test('deleteLevel', function(assert) {
  const component = this.subject();
  const level = Level.create({ id: 'level-test' });
  component.set('scoringLevels', Ember.A([level]));
  assert.equal(
    component.get('scoringLevels').length,
    1,
    'Scoring levels should has one level'
  );
  component.send('deleteLevel', level);
  assert.equal(
    component.get('scoringLevels').length,
    0,
    'Scoring levels should not has levels'
  );
});
