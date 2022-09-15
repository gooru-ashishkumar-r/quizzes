import { moduleFor, test } from 'ember-qunit';

moduleFor(
  'model:rubric/rubric-category',
  'Unit | Model | rubric/rubric-category',
  {
    unit: true
  }
);

test('scores', function(assert) {
  var model = this.subject({
    levels: [{ score: 2 }, { score: 2 }, { score: 2 }]
  });
  assert.equal(model.get('scores').length, 3, 'Should have 3 total counts');
});

test('totalPoints', function(assert) {
  var model = this.subject({
    levels: [{ score: 6 }, { score: 2 }, { score: 2 }]
  });
  assert.equal(model.get('totalPoints'), 6, 'Should have 6 total points');
});
