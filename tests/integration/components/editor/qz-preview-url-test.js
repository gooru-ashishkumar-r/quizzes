import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ResourceModel from 'quizzes-addon/models/resource/resource';

const quizzesConfigurationServiceStub = Ember.Service.extend({
  configuration: {
    properties: {
      cdnURL: '//localhost/'
    }
  }
});

moduleForComponent(
  'qz-preview-url',
  'Integration | Component | qz preview url',
  {
    integration: true,
    beforeEach: function() {
      this.register(
        'service:quizzes/configuration',
        quizzesConfigurationServiceStub
      );
      this.inject.service('quizzes/configuration');
    }
  }
);

test('Preview url layout', function(assert) {
  assert.expect(2);

  this.render(hbs`{{qz-preview-url resource=resource isRubric=true}}`);

  var $component = this.$();

  assert.ok(
    $component.find('.qz-preview-url .preview.show-legend span').length,
    'Missing preview legend'
  );

  const resource = ResourceModel.create({
    body: 'http://www.water4all.org/us/'
  });
  this.set('resource', resource);

  assert.ok(
    $component.find('.qz-preview-url .preview.show-url').length,
    'Missing url preview'
  );
});

test('Show url', function(assert) {
  assert.expect(2);

  const resource = ResourceModel.create({
    body: 'http://www.water4all.org/us/'
  });

  this.set('resource', resource);
  this.render(hbs`{{qz-preview-url resource=resource}}`);

  var $component = this.$();

  assert.ok(
    $component.find('.qz-preview-url iframe').length,
    'Missing url preview'
  );
  assert.equal(
    $component.find('iframe').attr('src'),
    'http://www.water4all.org/us/',
    'Wrong url'
  );
});

test('Show image', function(assert) {
  assert.expect(2);

  const resource = ResourceModel.create({ body: 'test/images/icon.png' });
  this.set('resource', resource);

  this.render(hbs`{{qz-preview-url resource=resource}}`);

  var $component = this.$();
  assert.ok(
    $component.find('.qz-preview-url iframe').length,
    'Missing url preview'
  );
  assert.equal(
    $component.find('iframe').attr('src'),
    'https://localhost/test/images/icon.png',
    'Wrong url'
  );
});

test('Show PDF', function(assert) {
  assert.expect(2);

  const resource = ResourceModel.create({
    body: 'http://www.worldanimalfoundation.net/f/koala.pdf'
  });

  this.set('resource', resource);

  this.render(hbs`{{qz-preview-url resource=resource}}`);

  var $component = this.$();

  assert.ok(
    $component.find('.qz-preview-url iframe').length,
    'Missing url preview'
  );
  assert.equal(
    $component.find('iframe').attr('src'),
    'http://www.worldanimalfoundation.net/f/koala.pdf',
    'Wrong url'
  );
});
