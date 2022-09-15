import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import DS from 'ember-data';
import Ember from 'ember';
import KnowledgeModel from 'quizzes-addon/models/depth-of-knowledge';
import wait from 'ember-test-helpers/wait';

const lookupServiceStub = Ember.Service.extend({
  readDepthOfKnowledgeItems() {
    var promiseResponse;
    var response = [
      KnowledgeModel.create({ id: 1, name: 'Level 1: Recall', order: 1 }),
      KnowledgeModel.create({ id: 4, name: 'Level 4: Skill/Concept', order: 2 })
    ];

    promiseResponse = new Ember.RSVP.Promise(function(resolve) {
      Ember.run.next(this, function() {
        resolve(response);
      });
    });

    return DS.PromiseArray.create({
      promise: promiseResponse
    });
  }
});

moduleForComponent(
  'editor/assessment/qz-depth-of-knowledge',
  'Integration | Component | editor/assessment/qz depth-of-knowledge',
  {
    integration: true,
    beforeEach: function() {
      this.inject.service('i18n');
      this.register('service:quizzes/lookup', lookupServiceStub);
      this.inject.service('quizzes/lookup');
    }
  }
);

test('Depth of knowledge layout, no knowledge selected - read only', function(
  assert
) {
  var selectedKnowledge = [];

  this.set('selectedKnowledge', selectedKnowledge);

  this.render(hbs`
    {{editor/assessment/qz-depth-of-knowledge isEditing=false srcSelectedKnowledge=selectedKnowledge}}
  `);

  const $component = this.$('.content.qz-depth-of-knowledge');
  assert.ok($component.length, 'Component found');
  assert.ok(
    $component.find('> label span').text(),
    this.get('i18n').t('common.depth-of-knowledge').string,
    'Label'
  );
  assert.ok(
    $component.find('> div span').text(),
    this.get('i18n').t('common.not-specified').string,
    'No selected knowledge should be visible'
  );
});

test('Depth of knowledge layout, knowledge selected - read only', function(
  assert
) {
  var selectedKnowledge = [4];

  this.set('selectedKnowledge', selectedKnowledge);

  this.render(hbs`
    {{editor/assessment/qz-depth-of-knowledge isEditing=false srcSelectedKnowledge=selectedKnowledge}}
  `);

  const $component = this.$('.content.qz-depth-of-knowledge');
  return wait().then(function() {
    assert.ok($component.length, 'Component found');
    assert.equal($component.find('.btn-empty').length, 1, 'Knowledge selected');
  });
});

test('Depth of knowledge layout - edit', function(assert) {
  var initialKnowledge = [1, 4];
  var selectedKnowledge = [1, 4];

  this.set('initialKnowledge', initialKnowledge);
  this.set('selectedKnowledge', selectedKnowledge);

  this.render(hbs`
    {{editor/assessment/qz-depth-of-knowledge isEditing=true srcSelectedKnowledge=initialKnowledge editSelectedKnowledge=selectedKnowledge}}
  `);

  const $component = this.$('.content.qz-depth-of-knowledge');
  assert.ok(
    $component.find('.depth-of-knowledge').length,
    'depth-of-knowledge container'
  );

  return wait().then(function() {
    const $knowledgeList = $component.find('ul');

    assert.equal($knowledgeList.find('li').length, 2, 'knowledge options');
    assert.equal(
      $knowledgeList.find('li input:checked').length,
      2,
      'knowledge options'
    );
  });
});

test('Depth of knowledge edit, add knowledge -returning to edit mode will discard any changes', function(
  assert
) {
  var initialKnowledge = [1];
  var selectedKnowledge = [1];

  this.set('initialKnowledge', initialKnowledge);
  this.set('selectedKnowledge', selectedKnowledge);
  this.set('isEditing', true);

  this.render(hbs`
    {{editor/assessment/qz-depth-of-knowledge isEditing=isEditing srcSelectedKnowledge=initialKnowledge editSelectedKnowledge=selectedKnowledge}}
  `);

  const $component = this.$('.content.qz-depth-of-knowledge');
  return wait().then(function() {
    var $knowledgeList = $component.find('ul');
    assert.equal(
      $knowledgeList.find('li input:checked').length,
      1,
      'Checked knowledge options'
    );

    $knowledgeList.find('li input:eq(1)').click();
    assert.equal(
      $knowledgeList.find('li input:checked').length,
      2,
      'Checked knowledge options after addition'
    );

    $knowledgeList = $component.find('ul');
    assert.equal(
      $knowledgeList.find('li input:checked').length,
      2,
      'Checked knowledge options -after returning to edit mode'
    );
  });
});
