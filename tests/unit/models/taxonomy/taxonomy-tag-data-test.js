import { moduleFor, test } from 'ember-qunit';
import TaxonomyTagData from 'quizzes-addon/models/taxonomy/taxonomy-tag-data';

moduleFor(
  'model:taxonomy/taxonomy-tag-data',
  'Unit | Model | taxonomy/taxonomy-tag-data',
  {
    unit: true
  }
);

test('isMicroStandardId', function(assert) {
  assert.equal(
    TaxonomyTagData.isMicroStandardId('NGSS.K12.SC-MS-BE-01'),
    false,
    'NGSS Standard'
  );
  assert.equal(
    TaxonomyTagData.isMicroStandardId('NGSS.K12.SC-MS-BE-02-01'),
    true,
    'NGSS Learning Target'
  );
  assert.equal(
    TaxonomyTagData.isMicroStandardId('CCSS.K12.MA-HSF-BF-B.02.02'),
    false,
    'CSS Sub-Standard'
  );
  assert.equal(
    TaxonomyTagData.isMicroStandardId('CCSS.K12.MA-HSF-BF-B.02.02.03'),
    true,
    'CSS Learning Target'
  );
});
