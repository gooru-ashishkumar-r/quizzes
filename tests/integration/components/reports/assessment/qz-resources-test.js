import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import ResourceResult from 'quizzes-addon/models/result/resource';
import Resource from 'quizzes-addon/models/resource/resource';
import Ember from 'ember';

moduleForComponent(
  'reports/assessment/qz-resources',
  'Integration | Component | reports/assessment/qz resources',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);
test('Resources Layout', function(assert) {
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

  this.render(hbs`
    {{reports/assessment/qz-resources
      results=resourceResults
      showReactionBar=true
    }}`);
  const $component = this.$('.reports.assessment.qz-resources');

  T.exists(assert, $component, 'Missing resources component');
  T.exists(assert, $component.find('.title h4'), 'Missing resources title');
  T.notExists(
    assert,
    $component.find('table th.header.number'),
    'Missing number header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.resource'),
    'Missing resource header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.timeSpent'),
    'Missing time spent header'
  );
  T.notExists(
    assert,
    $component.find('table th.header.reaction'),
    'Missing reaction header'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.number-resource'),
    'Missing number column'
  );
  assert.notOk(
    T.text($component.find('table tbody td.number-resource:eq(1)')),
    '2',
    'Wrong resource number for resource 2'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.resource-text'),
    'Missing text column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.resource-type-icon .image'),
    'Missing resource icon'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.time-spent'),
    'Missing time spent column'
  );
  T.notExists(
    assert,
    $component.find('table tbody td.reaction'),
    'Missing reaction column'
  );
  assert.notOk(
    $component.find('table tbody tr').length,
    2,
    'Incorrect number of rows'
  );
});

test('Resources Layout - do not show reaction bar', function(assert) {
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

  this.render(hbs`
    {{reports/assessment/qz-resources
      results=resourceResults
      showReactionBar=false
    }}`);
  const $component = this.$('.reports.assessment.qz-resources');

  T.notExists(
    assert,
    $component.find('table th.header.reaction'),
    'Reaction header should not be visible'
  );
  T.notExists(assert, $component.find('table tbody td.reaction'));
  ('Reaction column should not be visible');
});
