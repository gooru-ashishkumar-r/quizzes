import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import T from 'dummy/tests/helpers/assert';
import QuestionResult from 'quizzes-addon/models/result/question';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'player/qz-player-footer',
  'Integration | Component | player/qz player footer',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Player Footer Navigator', function(assert) {
  assert.expect(14);

  const resourceMockA = Ember.Object.create({
    id: '1',
    title: '<p>Resource #1</p>',
    format: 'question',
    isQuestion: true
  });

  const resourceMockB = Ember.Object.create({
    id: '2',
    title: 'Resource #2',
    format: 'webpage',
    isQuestion: false
  });

  const collectionMock = Ember.Object.create({
    id: '490ffa82-aa15-4101-81e7-e148002f90af',
    title: 'Test collection',
    resources: Ember.A([resourceMockA, resourceMockB]),
    lastVisitedResource: resourceMockB,
    getResourceById: function(id) {
      if (id === '1') {
        return resourceMockA;
      } else if (id === '2') {
        return resourceMockB;
      }
    }
  });

  const resourceResults = Ember.A([
    QuestionResult.create({ resource: resourceMockA }),
    QuestionResult.create({ resource: resourceMockB })
  ]);

  this.set('collection', collectionMock);
  this.set('resourceResults', resourceResults);

  this.render(hbs`{{player/qz-player-footer collection=collection
      resourceResults=resourceResults lessonTitle='E-Lesson1'
      selectedResourceId='1' onItemSelected='itemSelected'}}`);

  var $component = this.$(); //component dom element
  const $playerFooter = $component.find('.qz-player-footer');
  T.exists(assert, $playerFooter, 'Missing player footer section');
  T.exists(
    assert,
    $playerFooter.find('.prev'),
    'Missing player previous button.'
  );
  T.exists(
    assert,
    $playerFooter.find('.submit-all'),
    'Missing submit all button.'
  );

  const $playerInfo = $component.find('.player-info');
  const $playerContainer = $component.find('.player-container');
  T.exists(assert, $playerInfo, 'Missing player footer info section.');
  T.exists(
    assert,
    $playerContainer.find('.list-resource-nav i'),
    'Missing player footer resources list pull up/down button.'
  );
  T.exists(
    assert,
    $playerInfo.find('.resource-icon'),
    'Missing player footer currently playing resource icon.'
  );
  T.exists(
    assert,
    $playerInfo.find('.resource-title'),
    'Missing player footer currently playing resource title.'
  );

  const $reactionBar = $component.find('.reaction-bar');
  T.notExists(assert, $reactionBar, 'Missing player footer reaction bar.');

  //$collectionResources list
  const $collectionResources = $playerFooter.find('.list-resources');
  T.exists(assert, $collectionResources, 'Missing collection resources');
  const $resourceItems = $collectionResources.find('li.list-group-item');
  assert.equal(
    $resourceItems.length,
    2,
    'Missing resources with list-group-item class'
  );
  const $firstResourceItem = $collectionResources.find(
    'li.list-group-item:eq(0)'
  );
  T.exists(
    assert,
    $firstResourceItem.find('.resources-info'),
    'Missing resources info'
  );
  T.exists(
    assert,
    $firstResourceItem.find('.resources-info .question'),
    'Missing question class type'
  );
  assert.equal(
    T.text($firstResourceItem.find('.resources-info .title')),
    'Resource #1',
    'Wrong item text'
  );

  //$resourceItem Selected
  const $selected = $playerFooter.find('.list-group-item:eq(0).selected');
  T.exists(assert, $selected, 'Incorrect selected resource 1');
});
