import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'player/resources/qz-vimeo-resource',
  'Integration | Component | player/resources/qz vimeo resource',
  {
    integration: true
  }
);

test('Vimeo resource layout', function(assert) {
  assert.expect(2);

  const resource = Ember.Object.create({
    id: 10,
    order: 2,
    resourceType: 'vimeo/video',
    resourceFormat: 'video',
    body: 'https://vimeo.com/11590751'
  });

  this.set('resource', resource);
  this.render(hbs`{{player/resources/qz-vimeo-resource resource=resource}}`);

  var $component = this.$(); //component dom element

  T.exists(
    assert,
    $component.find('.qz-vimeo-resource iframe'),
    'Missing youtube player element'
  );
  assert.equal(
    $component.find('iframe').attr('src'),
    '//player.vimeo.com/video/11590751',
    'Wrong url'
  );
});
