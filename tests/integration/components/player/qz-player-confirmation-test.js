import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Context from 'quizzes-addon/models/context/context';
import Collection from 'quizzes-addon/models/collection/collection';
import Ember from 'ember';

const collectionServiceStub = Ember.Service.extend({
  getAssessment(assessmentId) {
    if (assessmentId) {
      let collection = Collection.create(
        Ember.getOwner(this).ownerInjection(),
        {
          id: 'collection-123',
          title: 'Sample Assessment Name'
        }
      );
      return Ember.RSVP.resolve(collection);
    } else {
      return Ember.RSVP.reject('Fetch failed');
    }
  }
});

moduleForComponent(
  'player/qz-player-confirmation',
  'Integration | Component | player/qz player confirmation',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
      this.register('service:quizzes/collection', collectionServiceStub);
      this.inject.service('quizzes/collection', { as: 'collectionService' });
    }
  }
);

test('Player confirmation Layout No more attempts', function(assert) {
  assert.expect(6);
  const attempts = 2;
  const collection = Collection.create({
    id: 'collection-123',
    settings: {
      attempts: 2
    },
    isAssessment: true
  });
  const context = Context.create({
    title: 'context-title'
  });

  this.on('closePlayer', function() {
    assert.ok(true, 'Back should be called');
  });

  this.set('attempts', attempts);
  this.set('context', context);
  this.set('collection', collection);
  this.render(
    hbs`{{player/qz-player-confirmation hasCollectionItems=true attempts=attempts collection=collection context=context onClosePlayer='closePlayer'}}`
  );
  var $component = this.$();
  const $back = $component.find('.qz-player-confirmation .footer .back');
  assert.ok(
    $component.find('.qz-player-confirmation').length,
    'Player confirmation component should appear'
  );
  assert.ok(
    $component.find('.qz-player-confirmation .header-content .title').length,
    'Missing title'
  );
  assert.ok(
    $component.find('.qz-player-confirmation .confirmation-panel .description')
      .length,
    'Missing description'
  );
  assert.ok(
    $component.find('.qz-player-confirmation .attempts .no-more').length,
    'Missing no more attempts lead'
  );
  assert.notOk(
    $component.find('.qz-player-confirmation .footer .start').length,
    'Start button should not appear'
  );
  assert.notOk(
    $component.find('.qz-player-confirmation .footer .continue').length,
    'Continue button should not appear'
  );
  $back.click();
});

test('Player confirmation Layout has more attempts', function(assert) {
  assert.expect(1);
  const attempts = 2;
  const collection = Collection.create({
    id: 'collection-123',
    settings: {
      attempts: 4
    },
    isAssessment: true
  });
  const context = Context.create({
    title: 'context-title'
  });
  this.set('attempts', attempts);
  this.set('context', context);
  this.set('collection', collection);
  this.on('closePlayer', function() {
    assert.ok(true, 'Cancel should be called');
  });
  this.render(
    hbs`{{player/qz-player-confirmation attempts=attempts collection=collection context=context onClosePlayer='closePlayer'}}`
  );
  var $component = this.$();
  const $cancel = $component.find('.qz-player-confirmation .footer .cancel');
  assert.notOk(
    $component.find('.qz-player-confirmation .attempts .no-more').length,
    'Missing no more attempts lead'
  );
  $cancel.click();
});

test('Player confirmation Layout Not bidirectional', function(assert) {
  const attempts = 2;
  const collection = Collection.create({
    id: 'collection-123',
    settings: {
      attempts: 4,
      bidirectional: false
    },
    isAssessment: true
  });
  const context = Context.create({
    title: 'context-title'
  });
  this.set('attempts', attempts);
  this.set('context', context);
  this.set('collection', collection);
  this.render(
    hbs`{{player/qz-player-confirmation attempts=attempts collection=collection context=context}}`
  );
  var $component = this.$();
  assert.notOk(
    $component.find('.qz-player-confirmation .action-info  .bidirectional')
      .length,
    'Bidirectional lead should not appear'
  );
});
