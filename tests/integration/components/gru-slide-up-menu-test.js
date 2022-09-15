import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent(
  'gru-slide-up-menu',
  'Integration | Component | gru slide up menu',
  {
    integration: true
  }
);

test('Slide menu not visible', function(assert) {
  this.render(hbs`{{gru-slide-up-menu}}`);
  var $slideMenu = this.$().find('.gru-slide-up-menu');
  assert.ok($slideMenu.hasClass('hide'), 'Slide up menu should be hide');
});

test('Slide menu visible', function(assert) {
  const assignment = Ember.Object.create({
    id: 'id'
  });

  const options = Ember.A([
    Ember.Object.create({
      option: 'launch',
      action: 'onLaunch',
      object: assignment
    }),
    Ember.Object.create({
      option: 'assign',
      action: 'onAssign',
      object: assignment
    }),
    Ember.Object.create({
      option: 'preview',
      action: 'onPreview',
      object: assignment
    })
  ]);

  this.set('options', options);

  this.set('visible', true);

  this.render(hbs`{{gru-slide-up-menu visible=visible options=options}}`);

  var $slideMenu = this.$().find('.gru-slide-up-menu');
  assert.notOk($slideMenu.hasClass('hide'), 'Slide up menu should be visible');
  assert.ok(
    $slideMenu.find('.disabled').length,
    'Should have disabled section'
  );
  assert.ok(
    $slideMenu.find(`a.${options[0].get('option')}`),
    `Should have ${options[0].get('option')} option`
  );
  assert.ok(
    $slideMenu.find(`a.${options[1].get('option')}`),
    `Should have ${options[1].get('option')} option`
  );
  assert.ok(
    $slideMenu.find(`a.${options[2].get('option')}`),
    `Should have ${options[2].get('option')} option`
  );
});

test('Test action', function(assert) {
  const assignment = Ember.Object.create({
    id: 'id'
  });

  const options = Ember.A([
    Ember.Object.create({
      option: 'launch',
      action: 'onLaunch',
      object: assignment
    }),
    Ember.Object.create({
      option: 'assign',
      action: 'onAssign',
      object: assignment
    }),
    Ember.Object.create({
      option: 'preview',
      action: 'onPreview',
      object: assignment
    })
  ]);

  this.on('parentAction', function() {
    assert.ok(true, `Should call ${options[0].get('action')} action`);
  });

  this.set('options', options);

  this.set('visible', true);

  this.render(
    hbs`{{gru-slide-up-menu visible=visible options=options onAssign="parentAction"}}`
  );

  var $component = this.$(); //component dom element
  var $option = $component.find(`a.${options[1].get('option')}`);
  $option.click();
});
