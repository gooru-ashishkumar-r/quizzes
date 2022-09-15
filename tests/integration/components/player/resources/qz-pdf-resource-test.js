import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';

moduleForComponent(
  'player/resources/qz-pdf-resource',
  'Integration | Component |  player/resources/qz pdf resource',
  {
    integration: true
  }
);
test('PDF player layout', function(assert) {
  assert.expect(2);

  const resource = Ember.Object.create({
    id: 10,
    gooruOid: 'c261c2bd-cb56-4a90-bfa4-26fa332ff93b',
    resourceType: 'handouts',
    assetUrl:
      'http://qacdn.gooru.org/qalive/f000/2441/3308/GooruLearnYourWay.pdf'
  });

  this.set('resource', resource);
  this.render(hbs`{{player/resources/qz-pdf-resource resource=resource}}`);

  var $component = this.$(); //component dom element

  T.exists(
    assert,
    $component.find('.qz-pdf-resource iframe'),
    'Missing pdf resource element'
  );
  assert.equal(
    $component.find('iframe').attr('src'),
    'http://qacdn.gooru.org/qalive/f000/2441/3308/GooruLearnYourWay.pdf',
    'Wrong url'
  );
});
