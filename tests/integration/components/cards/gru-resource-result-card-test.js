import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent(
  'cards/gru-resource-result-card',
  'Integration | Component | cards/gru resource result card',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
      this.inject.service('i18n');
    }
  }
);

test('Resource card that is not a question and it has not been started', function(
  assert
) {
  assert.expect(6);

  const mockResourceResult = Ember.Object.create({
    resource: {
      resourceFormat: 'video',
      title: 'Learn the MEAN Stack.'
    }
  });

  this.set('mockResourceResult', mockResourceResult);

  this.render(hbs`{{cards/gru-resource-result-card item=mockResourceResult}}`);

  const $component = this.$('.gru-resource-result-card');
  assert.ok($component, 'Component does not have the component class');

  const $detailsContainer = $component.find('.panel');
  assert.ok($detailsContainer, 'Details container not found');

  const $resourceIcon = $detailsContainer.find('.card-icon i.resource-icon');
  assert.ok($resourceIcon, 'Icon not found');

  const $resourceTitle = $detailsContainer.find('.resource-description .title');

  assert.equal(
    T.text($resourceTitle),
    'Learn the MEAN Stack.',
    'Incorrect title'
  );

  const $resourceFormat = $detailsContainer.find(
    '.resource-description .format'
  );

  assert.equal(
    T.text($resourceFormat),
    this.get('i18n')
      .t(`common.resource-format.${mockResourceResult.resource.resourceFormat}`)
      .toString(),
    'Wrong resource type text'
  );

  const $resultContainer = $component.find('.result-details');
  assert.ok($resultContainer, 'Result container not found');

  //const $resultStatus = $resultContainer.find('p.status');
  //assert.equal(T.text($resultStatus), this.get('i18n').t('cards.gru-resource-result-card.skipped').toString(), 'Wrong result status text');
});

test('Resource card that is not a question and it has been viewed but not reacted to', function(
  assert
) {
  assert.expect(3);

  const mockResourceResult = Ember.Object.create({
    timeSpent: 12345,
    resource: {
      resourceFormat: 'video',
      title: 'Learn the MEAN Stack.'
    }
  });

  this.set('mockResourceResult', mockResourceResult);

  this.render(hbs`{{cards/gru-resource-result-card item=mockResourceResult}}`);

  const $component = this.$('.gru-resource-result-card');
  assert.ok($component, 'Component does not have the component class');

  const $resultContainer = $component.find('.result-details');
  assert.ok($resultContainer, 'Result container not found');

  const $timeSpentParagraph = $resultContainer.find('div.time-spent p');
  assert.ok($timeSpentParagraph, 'Result container not found');
});

test('Resource card that is not a question and it has been viewed but reacted to', function(
  assert
) {
  assert.expect(4);
  const mockResourceResult = Ember.Object.create({
    timeSpent: 12345,
    reaction: 3,
    resource: {
      resourceFormat: 'video',
      title: 'Learn the MEAN Stack.'
    }
  });

  this.set('mockResourceResult', mockResourceResult);

  this.render(hbs`{{cards/gru-resource-result-card item=mockResourceResult}}`);

  const $component = this.$('.gru-resource-result-card');
  assert.ok($component, 'Component does not have the component class');

  const $resultContainer = $component.find('.result-details');
  assert.ok($resultContainer, 'Result container not found');

  const $timeSpentParagraph = $resultContainer.find('div.time-spent p');
  assert.ok($timeSpentParagraph, 'Result container not found');

  const $reactionIcon = $resultContainer.find('div.resource-reaction i');
  assert.ok($reactionIcon, 'Reaction not found');
});

test('Resource card that is a question', function(assert) {
  assert.expect(4);
  const mockQuestionResult = Ember.Object.create({
    resource: {
      resourceFormat: 'question',
      title: 'Learn the MEAN Stack.',
      type: 'text_entry',
      isQuestion: true
    }
  });

  this.set('mockQuestionResult', mockQuestionResult);

  this.render(hbs`{{cards/gru-resource-result-card item=mockQuestionResult}}`);

  const $component = this.$('.gru-resource-result-card');
  assert.ok($component, 'Component does not have the component class');

  const $detailsContainer = $component.find('.panel');
  assert.ok($detailsContainer, 'Details container not found');

  const $questionIcon = $detailsContainer.find('.card-icon i.question-icon');
  assert.ok($questionIcon, 'Icon not found');

  const $type = $detailsContainer.find('.resource-description .format');
  assert.equal(
    T.text($type),
    this.get('i18n')
      .t(`common.question-type.${mockQuestionResult.resource.type}`)
      .toString(),
    'Wrong question type text'
  );
});
