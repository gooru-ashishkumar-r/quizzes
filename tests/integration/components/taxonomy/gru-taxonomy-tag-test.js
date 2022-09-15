import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';
import TaxonomyTag from 'quizzes-addon/models/taxonomy/taxonomy-tag';

moduleForComponent(
  'taxonomy/gru-taxonomy-tag',
  'Integration | Component | taxonomy/gru taxonomy tag',
  {
    integration: true
  }
);

test('it renders a taxonomy tag correctly', function(assert) {
  var taxonomyTag = TaxonomyTag.create({
    isActive: false,
    isReadonly: false,
    isRemovable: false,
    data: TaxonomyTagData.create({
      id: 'term-123',
      code: 'ST.03',
      frameworkCode: 'GDF',
      parentTitle: 'Subject'
    })
  });
  this.set('taxonomyTag', taxonomyTag);

  this.render(hbs`{{taxonomy/gru-taxonomy-tag model=taxonomyTag}}`);

  const $component = this.$('.taxonomy.gru-taxonomy-tag');
  assert.ok($component.length, 'Component');

  assert.notOk($component.hasClass('active'), 'Active class by default');
  assert.notOk($component.hasClass('read-only'), 'Read only class by default');
  assert.notOk(
    $component.find('button.remove').length,
    'Remove button by default'
  );
  assert.ok(
    $component.find('button.toggle').length,
    'Toggle button by default'
  );
  assert.equal(
    $component.find('button.toggle > div > b').text(),
    'ST.03',
    'Tag label -button'
  );
  assert.equal(
    $component.find('button.toggle > div > span').text(),
    'GDF Subject',
    'Tag caption -button'
  );

  this.set('taxonomyTag.isActive', true);
  assert.ok($component.hasClass('active'), 'Active');

  this.set('taxonomyTag.isReadonly', true);
  assert.ok($component.hasClass('read-only'), 'Read-only');
  assert.notOk(
    $component.find('button.toggle').length,
    'Toggle button -read-only'
  );
  assert.equal(
    $component.find('> div > b').text(),
    'ST.03',
    'Tag label -read-only'
  );
  assert.equal(
    $component.find('> div > span').text(),
    'GDF Subject',
    'Tag caption -read-only'
  );

  this.set('taxonomyTag.isRemovable', true);
  assert.ok($component.find('button.remove').length, 'Removable');
});

test('if it is not read-only, it calls an external action when the tag is clicked', function(
  assert
) {
  assert.expect(2);

  var taxonomyTag = TaxonomyTag.create({
    isActive: false,
    data: TaxonomyTagData.create({
      id: 'term-123',
      code: 'ST.03',
      frameworkCode: 'GDF',
      parentTitle: 'Subject'
    })
  });
  this.set('taxonomyTag', taxonomyTag);

  this.on('externalAction', function(model) {
    assert.ok(true, 'External action called');
    assert.equal(model instanceof TaxonomyTag, true, 'Action parameter');
  });

  this.render(
    hbs`{{taxonomy/gru-taxonomy-tag model=taxonomyTag onSelect=(action 'externalAction')}}`
  );

  const $component = this.$('.taxonomy.gru-taxonomy-tag');
  $component.find('button.toggle').click();
});

test('it calls an external action when its remove button is clicked', function(
  assert
) {
  assert.expect(2);

  var taxonomyTag = TaxonomyTag.create({
    isRemovable: true,
    data: TaxonomyTagData.create({
      id: 'term-123',
      code: 'ST.03',
      frameworkCode: 'GDF',
      parentTitle: 'Subject'
    })
  });
  this.set('taxonomyTag', taxonomyTag);

  this.on('externalAction', function(model) {
    assert.ok(true, 'External action called');
    assert.equal(model instanceof TaxonomyTag, true, 'Action parameter');
  });

  this.render(
    hbs`{{taxonomy/gru-taxonomy-tag model=taxonomyTag onRemove=(action 'externalAction')}}`
  );

  const $component = this.$('.taxonomy.gru-taxonomy-tag');
  $component.find('button.remove').click();
});
