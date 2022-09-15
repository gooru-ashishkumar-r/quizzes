import { moduleFor, test } from 'ember-qunit';
import BrowseItem from 'quizzes-addon/models/taxonomy/browse-item';
import TaxonomyItem from 'quizzes-addon/models/taxonomy/taxonomy-item';

moduleFor('model:taxonomy/browse-item', 'Unit | Model | taxonomy/browse-item', {
  unit: true
});

test('createFromTaxonomyItem -copy up to one level', function(assert) {
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
    }),
    TaxonomyItem.create({
      id: '31B',
      level: 3,
      parent: children[1]
    })
  ];

  children[0].set('children', children2A);
  children[1].set('children', children2B);

  var rootTaxonomyItem = TaxonomyItem.create({
    id: '10',
    level: 1,
    parent: null,
    children: children
  });

  var browseItem = BrowseItem.createFromTaxonomyItem(rootTaxonomyItem, 1);

  assert.ok(browseItem, 'Browse item');
  assert.equal(browseItem.get('id'), '10', 'Browse item id');
  assert.equal(browseItem.children.length, 0, 'Browse item children');
});

test('createFromTaxonomyItem -copy up to two levels', function(assert) {
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
    }),
    TaxonomyItem.create({
      id: '31B',
      level: 3,
      parent: children[1]
    })
  ];

  children[0].set('children', children2A);
  children[1].set('children', children2B);

  var rootTaxonomyItem = TaxonomyItem.create({
    id: '10',
    level: 1,
    parent: null,
    children: children
  });

  var browseItem = BrowseItem.createFromTaxonomyItem(rootTaxonomyItem, 2);

  assert.ok(browseItem, 'Browse item');
  assert.equal(browseItem.get('id'), '10', 'Browse item id');
  assert.equal(browseItem.get('children').length, 2, 'Browse item children');

  assert.equal(browseItem.children[0].get('id'), '20', 'First child ID');
  assert.equal(
    browseItem.children[0].get('children').length,
    0,
    'First child children'
  );

  assert.equal(browseItem.children[1].get('id'), '21', 'Second child ID');
  assert.equal(
    browseItem.children[1].get('children').length,
    0,
    'Second child children'
  );
});

test('createFromTaxonomyItem -copy up to three levels', function(assert) {
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
    }),
    TaxonomyItem.create({
      id: '31B',
      level: 3,
      parent: children[1]
    })
  ];

  children[0].set('children', children2A);
  children[1].set('children', children2B);

  var rootTaxonomyItem = TaxonomyItem.create({
    id: '10',
    level: 1,
    parent: null,
    children: children
  });

  var browseItem = BrowseItem.createFromTaxonomyItem(rootTaxonomyItem, 3);

  assert.ok(browseItem, 'Browse item');
  assert.equal(browseItem.get('id'), '10', 'Browse item id');
  assert.equal(browseItem.get('children').length, 2, 'Browse item children');

  assert.equal(browseItem.children[0].get('id'), '20', 'First child ID');
  assert.equal(
    browseItem.children[0].get('children').length,
    2,
    'First child children'
  );

  assert.equal(browseItem.children[1].get('id'), '21', 'Second child ID');
  assert.equal(
    browseItem.children[1].get('children').length,
    2,
    'Second child children'
  );

  assert.equal(
    browseItem.find(['10', '20', '30A']).get('id'),
    '30A',
    'Third level child -first branch'
  );
  assert.equal(
    browseItem.find(['10', '21', '31B']).get('id'),
    '31B',
    'Third level child -second branch'
  );
});
