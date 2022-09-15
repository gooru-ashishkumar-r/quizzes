import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'player/resources/qz-url-resource',
  'Integration | Component | player/resources/qz url resource',
  {
    integration: true
  }
);

test('Url resource layout', function(assert) {
  assert.expect(2);

  const resource = Ember.Object.create({
    id: 12,
    order: 2,
    resourceType: 'resource/url',
    resourceFormat: 'video',
    url: 'http://www.water4all.org/us/'
  });

  this.set('resource', resource);
  this.render(hbs`{{player/resources/qz-url-resource resource=resource}}`);

  var $component = this.$(); //component dom element

  T.exists(
    assert,
    $component.find('.qz-url-resource iframe'),
    'Missing url resource element'
  );
  assert.equal(
    $component.find('iframe').attr('src'),
    'http://www.water4all.org/us/',
    'Wrong url'
  );
});
