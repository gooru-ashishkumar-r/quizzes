import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import TaxonomyItem from 'quizzes-addon/models/taxonomy/taxonomy-item';

moduleFor(
  'model:taxonomy/taxonomy-item',
  'Unit | Model | taxonomy/taxonomy-item',
  {
    unit: true
  }
);

test('getPath with no ancestors', function(assert) {
  var model = this.subject({
    id: 'ti-1',
    level: 1,
    parent: null
  });

  assert.deepEqual(model.getPath(), ['ti-1'], 'path');
});

test('getPath with ancestors', function(assert) {
  var model = this.subject({
    id: 'ti-3',
    level: 3,
    parent: TaxonomyItem.create({
      id: 'ti-2',
      level: 2,
      parent: TaxonomyItem.create({
        id: 'ti-1',
        level: 1,
        parent: null
      })
    })
  });

  assert.deepEqual(model.getPath(), ['ti-1', 'ti-2', 'ti-3'], 'path');
});

test('find', function(assert) {
  var child3BA = TaxonomyItem.create({
    id: 'ti-3BA',
    children: []
  });

  var child2A = TaxonomyItem.create({
    id: 'ti-2A',
    children: []
  });

  var child2B = TaxonomyItem.create({
    id: 'ti-2B',
    children: [child3BA]
  });

  var model = this.subject({
    id: 'ti-1A',
    children: [child2A, child2B]
  });

  assert.equal(model.find(undefined), null, 'no result -undefined');
  assert.equal(model.find(undefined), null, 'no result -null');
  assert.equal(model.find([]), null, 'no result -empty array');
  assert.equal(model.find(['ti-1A']), model, 'result -level 1');
  assert.equal(model.find(['ti-1B']), null, 'no result -level 1');
  assert.equal(model.find(['ti-1A', 'ti-2A']), child2A, 'result -level 2 A');
  assert.equal(model.find(['ti-1A', 'ti-2B']), child2B, 'result -level 2 B');
  assert.equal(
    model.find(['ti-1A', 'ti-2A', 'ti-3AA']),
    null,
    'no result -level 3'
  );
  assert.equal(
    model.find(['ti-1A', 'ti-2B', 'ti-3BA']),
    child3BA,
    'result -level 3'
  );
});

test('destroyItem', function(assert) {
  var children = [
    TaxonomyItem.create({
      id: '20',
      level: 2
    }),
    TaxonomyItem.create({
      id: '21',
      level: 2
    })
  ];

  var children2A = [
    TaxonomyItem.create({
      id: '30A',
      level: 3,
      parent: children[0]
    }),
    TaxonomyItem.create({
      id: '31A',
      level: 3,
      parent: children[0]
    })
  ];

  var children2B = [
    TaxonomyItem.create({
      id: '30B',
      level: 3,
      parent: children[1]
    })
  ];

  children[0].set('children', children2A);
  children[1].set('children', children2B);

  var model = this.subject({
    id: '10',
    level: 1,
    parent: null,
    children: children
  });

  Ember.run(() => {
    model.destroyItem();
  });

  assert.equal(model.get('children'), null, 'Root children');
  assert.equal(model.get('isDestroyed'), true, 'Root children destroyed');

  assert.equal(children[0].get('parent'), null, 'First child -parent');
  assert.equal(children[0].get('children'), null, 'First child -children');
  assert.equal(children[0].get('isDestroyed'), true, 'First child destroyed');

  assert.equal(children[1].get('parent'), null, 'Second child -parent');
  assert.equal(children[1].get('children'), null, 'Second child -children');
  assert.equal(children[1].get('isDestroyed'), true, 'Second child destroyed');

  assert.equal(children2A[0].get('parent'), null, 'First grandchild -parent');
  assert.equal(
    children2A[0].get('children'),
    null,
    'First grandchild -children'
  );
  assert.equal(
    children2A[0].get('isDestroyed'),
    true,
    'First grandchild destroyed'
  );

  assert.equal(children2A[1].get('parent'), null, 'Second grandchild -parent');
  assert.equal(
    children2A[1].get('children'),
    null,
    'Second grandchild -children'
  );
  assert.equal(
    children2A[1].get('isDestroyed'),
    true,
    'Second grandchild destroyed'
  );

  assert.equal(children2B[0].get('parent'), null, 'Third grandchild -parent');
  assert.equal(
    children2B[0].get('children'),
    null,
    'Third grandchild -children'
  );
  assert.equal(
    children2B[0].get('isDestroyed'),
    true,
    'Third grandchild destroyed'
  );
});
