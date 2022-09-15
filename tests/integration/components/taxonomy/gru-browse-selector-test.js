import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';
import BrowseItem from 'quizzes-addon/models/taxonomy/browse-item';
import { generateBrowseTestTree } from 'quizzes-addon/utils/taxonomy';

moduleForComponent(
  'taxonomy/gru-browse-selector',
  'Integration | Component | taxonomy/gru browse selector',
  {
    integration: true
  }
);

test('it renders the browse panels', function(assert) {
  var data = generateBrowseTestTree(1, 0, 2);
  var headers = ['Header Level 1', 'Header Level 2', 'Header Level 3'];

  this.set('data', data);
  this.set('headers', headers);
  this.render(hbs`{{taxonomy/gru-browse-selector data=data headers=headers}}`);

  const $component = this.$('.taxonomy.gru-browse-selector');
  assert.ok($component.length, 'Component');
  assert.equal(
    $component.find('> ol > li').length,
    3,
    'Number of browse panels'
  );

  $component.find('> ol > li').each(function(index) {
    var $this = $(this);
    var level = index + 1;

    assert.equal(
      $this.find('> strong').text(),
      headers[index],
      `Panel title ${level}`
    );
    assert.ok(
      $this.find('> ul').hasClass('browse-panel'),
      `Panel browse class ${level}`
    );
    assert.ok(
      $this.find('> ul').hasClass(`level-${index + 1}`),
      `Panel level class ${level}`
    );

    if (index === 0) {
      assert.equal(
        $this.find('> ul > li').length,
        2,
        `Number of items in level ${level}`
      );
    } else {
      assert.equal(
        $this.find('> ul > li').length,
        0,
        `Number of items in level ${level}`
      );
    }
  });
});

test('it can populate the browse panels per a specific item path', function(
  assert
) {
  var data = generateBrowseTestTree(3);
  var headers = ['Header Level 1', 'Header Level 2', 'Header Level 3'];

  this.set('data', data);
  this.set('headers', headers);
  this.set('selectedPath', ['0-100', '0-100-200']); // IDs of the selected nodes
  this.render(
    hbs`{{taxonomy/gru-browse-selector data=data headers=headers selectedPath=selectedPath}}`
  );

  const $component = this.$('.taxonomy.gru-browse-selector');
  assert.equal(
    $component.find('> ol > li').length,
    3,
    'Number of browse panels'
  );

  $component.find('> ol > li').each(function(index) {
    var $this = $(this);
    assert.equal(
      $this.find('> ul > li').length,
      index + 1,
      `Number of items in level ${index + 1}`
    );

    if (index < headers.length - 1) {
      assert.equal(
        $this.find('> ul > li.active').length,
        1,
        `Number of items in selected path in level ${index + 1}`
      );
      assert.ok(
        $this.find('> ul > li:first-child').hasClass('active'),
        'Item in selected path'
      );
    } else {
      assert.equal(
        $this.find('> ul > li:first-child > p').text(),
        'Item : 3 : 0 : 0',
        'Correct item label'
      );
    }
  });
});

test('it calls an external action when clicking an item that is not in the last browse panel', function(
  assert
) {
  var data = generateBrowseTestTree(3);
  var headers = ['Header Level 1', 'Header Level 2', 'Header Level 3'];

  this.set('data', data);
  this.set('headers', headers);
  this.set('selectedPath', ['0-100', '0-100-200']); // IDs of the selected nodes

  this.on('externalAction', function() {
    assert.ok('true', 'External action called');
  });

  this.render(hbs`
    {{taxonomy/gru-browse-selector
      data=data
      headers=headers
      selectedPath=selectedPath
      onSelectItem=(action 'externalAction') }}`);

  const $component = this.$('.taxonomy.gru-browse-selector');

  $component.find('> ol > li').each(function(index) {
    if (index !== headers.length - 1) {
      const $this = $(this);
      const level = index + 1;
      assert.equal(
        $this.find('> ul > li.active').length,
        1,
        `Before: number of items in selected path in level ${level}`
      );
      assert.ok(
        $this.find('> ul > li:first-child').hasClass('active'),
        `Before: item in selected path in level ${level}`
      );
    }
  });
  assert.equal(
    $component.find('> ol > li:last-child > ul > li:first-child p').text(),
    'Item : 3 : 0 : 0',
    'Label of first item in the last panel'
  );

  // Click on the second item in the second panel
  $component.find('> ol > li:eq(1) a:eq(1)').click();
});

test('it loads sub-level items async', function(assert) {
  const rootItem = BrowseItem.create({
    parent: null,
    id: '0-100',
    title: 'Item : 1 : 0 : 0',
    level: 1,
    children: []
  });

  /**
   * Fetch children
   */
  function fetchChildrenFor(node) {
    const childNode = BrowseItem.create({
      parent: node,
      id: '0-100-200',
      title: 'Item : 2 : 0 : 0',
      level: 2
    });

    assert.ok('true', 'Async action called');
    return Ember.RSVP.resolve([childNode]);
  }

  var data = [rootItem];
  var headers = ['Header Level 1', 'Header Level 2', 'Header Level 3'];
  var component = this;

  this.set('data', data);
  this.set('headers', headers);
  this.set('selectedPath', []);

  this.on('externalAction', function(item) {
    // Load child into rootItem asynchronously
    fetchChildrenFor(rootItem).then(function(childrenList) {
      rootItem.set('children', childrenList);

      // Update the selected path after the data has been fetched
      component.set('selectedPath', item.getPath());
    });
  });

  this.render(hbs`
    {{taxonomy/gru-browse-selector
      data=data
      headers=headers
      selectedPath=selectedPath
      onSelectItem=(action 'externalAction')}}`);

  const $component = this.$('.taxonomy.gru-browse-selector');
  assert.ok($component.length, 'Component');

  assert.equal(
    $component.find('> ol > li:eq(0) > ul > li').length,
    1,
    'Number of items in level 1'
  );
  assert.equal(
    $component.find('> ol > li:eq(1) > ul > li').length,
    0,
    'Number of items in level 2'
  );

  // Click on the root item
  $component.find('> ol > li:eq(0) a:eq(0)').click();

  return wait().then(function() {
    assert.equal(
      $component.find('> ol > li:eq(0) > ul > li').length,
      1,
      'Number of items in level 1 -after clicking on root item'
    );
    assert.equal(
      $component.find('> ol > li:eq(1) > ul > li').length,
      1,
      'Number of items in level 2 -after clicking on root item'
    );
  });
});

test('it keeps track of checked items', function(assert) {
  //assert.expect(15);

  var data = generateBrowseTestTree(4);
  var headers = ['Header Level 1', 'Header Level 2', 'Header Level 3'];

  this.set('data', data);
  this.set('headers', headers);
  this.set('selectedPath', ['0-100', '0-100-200', '0-100-200-300']); // IDs of the selected nodes

  this.on('checkAction', function() {
    assert.ok(true, 'Check action called');
  });

  this.on('uncheckAction', function() {
    assert.ok(true, 'Un-check action called');
  });

  this.render(hbs`
    {{taxonomy/gru-browse-selector
      data=data
      headers=headers
      selectedPath=selectedPath
      onCheckItem=(action 'checkAction')
      onUncheckItem=(action 'uncheckAction') }}`);

  const $component = this.$('.taxonomy.gru-browse-selector');
  const $firstPanel = $component.find('> ol > li:eq(0) > ul');
  const $secondPanel = $component.find('> ol > li:eq(1) > ul');
  const $firstStandardCategory = $component.find(
    '> ol > li:eq(2) > ul > li:first-child'
  );

  assert.equal(
    $firstStandardCategory.find('> .standard').length,
    4,
    'Number of standards in the first standard category'
  );
  assert.equal(
    $firstStandardCategory.find('> .standard input[type="checkbox"]:checked')
      .length,
    0,
    'Number of checked items'
  );

  // Check the first two items
  $firstStandardCategory.find('> .standard input:eq(0)').click();
  $firstStandardCategory.find('> .standard input:eq(1)').click();

  assert.equal(
    $firstStandardCategory.find('> .standard input[type="checkbox"]:checked')
      .length,
    2,
    'Number of checked items -after checking two'
  );
  assert.ok(
    $firstPanel.find('> li:first-child').hasClass('selected'),
    'Parent selected?'
  );
  assert.ok(
    $secondPanel.find('> li:first-child').hasClass('selected'),
    'Grand parent selected?'
  );

  // Uncheck the first item
  $firstStandardCategory.find('> .standard input:eq(0)').click();
  assert.equal(
    $firstStandardCategory.find('> .standard input[type="checkbox"]:checked')
      .length,
    1,
    'Number of checked items -after unchecking one'
  );
  assert.ok(
    $firstPanel.find('> li:first-child').hasClass('selected'),
    'Parent selected? -after unchecking one'
  );
  assert.ok(
    $secondPanel.find('> li:first-child').hasClass('selected'),
    'Grand parent selected? -after unchecking one'
  );

  // Uncheck the other item
  $firstStandardCategory.find('> .standard input:eq(1)').click();
  assert.equal(
    $firstStandardCategory.find('> .standard input[type="checkbox"]:checked')
      .length,
    0,
    'Number of checked items -after unchecking the other'
  );
  assert.notOk(
    $firstPanel.find('> li:first-child').hasClass('selected'),
    'Parent selected? -after unchecking the other'
  );
  assert.notOk(
    $secondPanel.find('> li:first-child').hasClass('selected'),
    'Grand parent selected? -after unchecking the other'
  );
});
