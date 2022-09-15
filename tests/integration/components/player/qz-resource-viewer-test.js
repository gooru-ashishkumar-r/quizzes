import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { RESOURCE_TYPES } from 'quizzes-addon/config/quizzes-config';

moduleForComponent(
  'player/qz-resource-viewer',
  'Integration | Component | player/qz resource viewer',
  {
    integration: true,
    beforeEach: function() {
      this.i18n = this.container.lookup('service:i18n');
      this.i18n.set('locale', 'en');
    }
  }
);

test('Layout with image resource', function(assert) {
  assert.expect(1);

  const resource = ResourceModel.create({
    type: RESOURCE_TYPES.image,
    isImageResource: true
  });

  this.set('resource', resource);

  this.render(hbs`{{player/qz-resource-viewer resource=resource}}`);

  var $component = this.$(); //component dom element
  var $imageResourcePanel = $component.find('.qz-preview-url');
  T.exists(assert, $imageResourcePanel, 'Missing image resource panel');
});

test('Layout with text resource', function(assert) {
  assert.expect(2);

  const resource = ResourceModel.create({
    type: RESOURCE_TYPES.text
  });

  this.set('resource', resource);

  this.render(hbs`{{player/qz-resource-viewer resource=resource}}`);

  var $component = this.$(); //component dom element
  var $imageResourcePanel = $component.find('.qz-preview-url');
  T.exists(assert, $imageResourcePanel, 'Missing text resource panel');
  T.notExists(assert, $component.find('.btn-next'), 'Missing next button');
});

test('Layout with webpage resource with next button', function(assert) {
  assert.expect(2);

  const resource = ResourceModel.create({
    type: RESOURCE_TYPES.webpage
  });

  this.set('resource', resource);

  this.render(
    hbs`{{player/qz-resource-viewer resource=resource sendEvents=true}}`
  );

  var $component = this.$(); //component dom element
  var $imageResourcePanel = $component.find('.qz-preview-url');
  T.exists(assert, $imageResourcePanel, 'Missing webpage resource panel');
  T.exists(assert, $component.find('.btn-next'), 'Missing next button');
});

test('Layout with interactive resource', function(assert) {
  assert.expect(1);

  const resource = ResourceModel.create({
    type: RESOURCE_TYPES.interactive
  });

  this.set('resource', resource);

  this.render(hbs`{{player/qz-resource-viewer resource=resource}}`);

  var $component = this.$(); //component dom element
  var $imageResourcePanel = $component.find('.qz-preview-url');
  T.exists(assert, $imageResourcePanel, 'Missing interactive resource panel');
});

test('Layout with audio resource', function(assert) {
  assert.expect(1);

  const resource = ResourceModel.create({
    type: RESOURCE_TYPES.audio
  });

  this.set('resource', resource);

  this.render(hbs`{{player/qz-resource-viewer resource=resource}}`);

  var $component = this.$(); //component dom element
  var $imageResourcePanel = $component.find('.qz-preview-url');
  T.exists(assert, $imageResourcePanel, 'Missing audio resource panel');
});

test('Layout with youtube resource', function(assert) {
  assert.expect(1);

  const resource = ResourceModel.create({
    body: 'https://youtube.com/watch?v=12345678901',
    type: RESOURCE_TYPES.video
  });

  this.set('resource', resource);

  this.render(hbs`{{player/qz-resource-viewer resource=resource}}`);

  var $component = this.$(); //component dom element
  var $imageResourcePanel = $component.find('.qz-youtube-resource');
  T.exists(assert, $imageResourcePanel, 'Missing youtube resource panel');
});

test('Layout with vimeo resource', function(assert) {
  assert.expect(1);

  const resource = ResourceModel.create({
    body: 'http://vimeo.com/12345',
    type: RESOURCE_TYPES.video
  });

  this.set('resource', resource);

  this.render(hbs`{{player/qz-resource-viewer resource=resource}}`);

  var $component = this.$(); //component dom element
  var $imageResourcePanel = $component.find('.qz-vimeo-resource');
  T.exists(assert, $imageResourcePanel, 'Missing vimeo resource panel');
});

test('Layout when a resource url cannot be showed in an iframe', function(assert) {
  const resource = ResourceModel.create({
    displayGuide: {
      is_broken: 1,
      is_frame_breaker: 1
    },
    content: Ember.A([])
  });

  this.set('resource', resource);

  this.render(
    hbs`{{player/qz-resource-viewer-linkout resource=resource isNotIframeUrl=true}}`
  );

  var $component = this.$(); //component dom element

  const $panel = $component.find('.not-iframe');
  assert.ok($panel.length, 'Missing not-iframe panel');

  assert.ok(
    $panel.find('.panel-header').length,
    'panel-header of not-iframe panel'
  );
  assert.ok(
    $panel.find('.panel-body').length,
    'panel-body of not-iframe panel'
  );
  assert.ok(
    $panel.find('.panel-body .qz-resource-card').length,
    'Missing resource card'
  );
  assert.ok(
    $panel.find('.panel-body .external-browser a.play-btn').length,
    'Missing play button'
  );
  assert.ok(
    $panel.find('.panel-footer').length,
    'panel-footer of not-iframe panel'
  );
});
