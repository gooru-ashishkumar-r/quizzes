import Ember from 'ember';
import { moduleForComponent, test, skip } from 'ember-qunit';
import T from 'dummy/tests/helpers/assert';
import hbs from 'htmlbars-inline-precompile';
import QuestionResult from 'quizzes-addon/models/result/question';

moduleForComponent(
  'player/qz-viewer',
  'Integration | Component | player/qz viewer',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

skip('Narration', function(assert) {
  assert.expect(3);

  const resourceMockA = Ember.Object.create({
    id: 1,
    name: 'Resource #3',
    type: 'question',
    narration: 'Some narration message here',
    owner: {
      avatarUrl: '76514d68-5f4b-48e2-b4bc-879b745f3d70.png'
    },
    hasNarration: true,
    hasOwner: true
  });

  const resourceResult = QuestionResult.create();

  this.set('resourceResult', resourceResult);
  this.set('resource', resourceMockA);

  this.render(
    hbs`{{player/qz-viewer resource=resource resourceResult=resourceResult}}`
  );

  var $component = this.$(); //component dom element
  const $gruViewer = $component.find('.qz-viewer');
  T.exists(assert, $gruViewer, 'Missing narration section');
  T.exists(
    assert,
    $gruViewer.find('.narration .avatar img'),
    'Missing autor image'
  );
});

test('Layout when a resource url cannot be showed in an iframe', function(assert) {
  const resourceMockA = Ember.Object.create({
    id: '1',
    type: 'resource/url',
    displayGuide: {
      is_broken: 1,
      is_frame_breaker: 1
    },
    content: Ember.A([])
  });

  this.set('resource', resourceMockA);

  this.render(hbs`{{player/qz-viewer resource=resource isNotIframeUrl=true}}`);

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
  // play button moved to a different component when is_frame_breaker
  assert.ok(
    $panel.find('.panel-footer').length,
    'panel-footer of not-iframe panel'
  );
});
