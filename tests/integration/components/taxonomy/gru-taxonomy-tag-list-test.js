import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';
import TaxonomyTag from 'quizzes-addon/models/taxonomy/taxonomy-tag';

moduleForComponent(
  'taxonomy/gru-taxonomy-tag-list',
  'Integration | Component | taxonomy/gru taxonomy tag list',
  {
    integration: true
  }
);

test('it renders all tags correctly', function(assert) {
  const tags = [];
  for (var i = 0; i < 4; i++) {
    var tag = TaxonomyTag.create({
      isActive: false,
      isReadonly: false,
      isRemovable: false,
      data: TaxonomyTagData.create({
        id: `id-${i}`,
        code: `ST.03.${i}`,
        frameworkCode: 'GDF',
        parentTitle: 'Subject'
      })
    });
    tags.push(tag);
  }
  this.set('tags', tags);

  this.render(hbs`{{taxonomy/gru-taxonomy-tag-list tags=tags}}`);

  const $component = this.$('.taxonomy.gru-taxonomy-tag-list');
  assert.ok($component.length, 'Missing Component');
  assert.ok(
    !$component.find('.non-visible-tags').length,
    'Non visible tags component should not be visible'
  );

  const $tooltip = $('.tags-tooltip'); //the tooltip is injected out of the element
  assert.ok(!$tooltip.length, 'All tags tooltip should not be visible');
  assert.equal(
    $component.find('> .gru-taxonomy-tag').length,
    4,
    'Should tags should be visible'
  );
});

test('it renders max allowed tags correctly', function(assert) {
  const tags = [];
  for (var i = 0; i < 4; i++) {
    var tag = TaxonomyTag.create({
      isActive: false,
      isReadonly: false,
      isRemovable: false,
      data: TaxonomyTagData.create({
        id: `id-${i}`,
        code: `ST.03.${i}`,
        frameworkCode: 'GDF',
        parentTitle: 'Subject'
      })
    });
    tags.push(tag);
  }
  this.set('tags', tags);

  this.render(hbs`{{taxonomy/gru-taxonomy-tag-list tags=tags tagsVisible=2}}`);

  const $component = this.$('.taxonomy.gru-taxonomy-tag-list');
  assert.ok($component.length, 'Missing Component');
  assert.ok(
    $component.find('.non-visible-tags').length,
    'Non visible tags component should be visible'
  );
  assert.ok(!$component.find('.popover').length, 'Tooltip is not be visible');

  $component.find('.non-visible-tags').click();
  assert.ok($component.find('.popover').length, 'Tooltip is visible');
  assert.equal(
    $component.find('> .gru-taxonomy-tag').length,
    2,
    'Tags visible without the tooltip'
  );
  assert.equal(
    $component.find('.popover .gru-taxonomy-tag').length,
    4,
    'Tags visible in the tooltip'
  );
});
