import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import ResourceResult from 'quizzes-addon/models/result/resource';
import Resource from 'quizzes-addon/models/resource/resource';
import Ember from 'ember';

moduleForComponent(
  'reports/assessment/qz-resources-xs',
  'Integration | Component | reports/assessment/qz resources xs',
  {
    integration: true
  }
);

test('Questions Details Mobile Layout', function(assert) {
  assert.expect(6);

  const resourceResults = Ember.A([
    ResourceResult.create({
      resource: Resource.create({
        id: 'resource-1',
        title: 'Resource Title 1',
        sequence: 1,
        body: 'Resource 1',
        isResource: true
      }),
      reaction: 4,
      timeSpent: 2096
    }),
    ResourceResult.create({
      resource: Resource.create({
        id: 'resource-2',
        title: 'Resource Title 2',
        sequence: 2,
        body: 'Resource 2',
        isResource: true
      }),
      reaction: 2,
      timeSpent: 1096
    })
  ]);

  this.set('resourceResults', resourceResults);
  this.render(
    hbs`{{reports/assessment/qz-resources-xs results=resourceResults}}`
  );
  const $component = this.$(); //component dom element
  const $resource = $component.find('.qz-resources-xs');

  T.exists(assert, $resource, 'Missing resources-xs component');
  T.exists(
    assert,
    $resource.find('.resource-number'),
    'Missing resource number column'
  );
  T.exists(
    assert,
    $resource.find('.resource-text'),
    'Missing resource text column'
  );
  T.exists(
    assert,
    $resource.find('.resource-container'),
    'Missing resource container'
  );
  T.exists(
    assert,
    $resource.find('.resource-container .image'),
    'Missing resource icon'
  );
  T.exists(assert, $resource.find('.time-spent'), 'Missing time-spent column');
});
