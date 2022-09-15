import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleForComponent(
  'cards/qz-resource-card',
  'Integration | Component | cards/gru resource card',
  {
    integration: true
  }
);

test('Resource Card Layout', function(assert) {
  var resource = ResourceModel.create({
    title: 'Resource Title',
    format: 'video_resource',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    owner: Ember.Object.create({
      firstName: 'Publisher'
    }),
    standards: Ember.A([
      Ember.Object.create({
        description:
          'Use proportional relationships to solve multistep ratio and percent problems. Examples: simple interest, tax, markups and markdowns, gratuities and commissions, fees, percent increase and decrease, percent error.',
        code: 'CCSS.Math.Content.7.RP.A.3'
      }),
      Ember.Object.create({
        description:
          'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10.',
        code: 'CCSS.Math.Content.5.NBT.A.2'
      })
    ]),
    isVisibleOnProfile: false
  });

  this.set('resource', resource);
  this.render(hbs`{{cards/qz-resource-card resource=resource}}`);
  var $component = this.$(); //component dom element
  const $resourceCard = $component.find('.qz-resource-card');
  T.exists(
    assert,
    $resourceCard.find('.panel-heading h6.title'),
    'Missing Title'
  );
  T.exists(
    assert,
    $resourceCard.find(`.panel-heading i.${resource.format}-icon`),
    'Missing Resource Icon'
  );
  assert.equal(
    T.text($resourceCard.find('.panel-heading .resource-type span')),
    'Video',
    'Incorrect  resource type'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-body .gru-taxonomy-tag-list'),
    'Missing standards'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-body .publisher img'),
    'Missing Publisher Image'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-body .publisher .owner a'),
    'Missing Owner Name'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-body .description p'),
    'Missing Description'
  );
  T.notExists(
    assert,
    $resourceCard.find('.panel-footer button.edit-btn'),
    'Edit Button should not be visible'
  );
  T.notExists(
    assert,
    $resourceCard.find('.panel-footer button.play-btn'),
    'Play Button should not be visible'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-footer .visibility .pull-right'),
    'Missing visibility icon'
  );
});

test('Question Card Layout', function(assert) {
  var question = ResourceModel.create({
    title: 'Question Title',
    format: 'question',
    type: QUESTION_TYPES.singleChoice,
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    owner: Ember.Object.create({
      firstName: 'Publisher'
    }),
    standards: Ember.A([
      Ember.Object.create({
        description:
          'Use proportional relationships to solve multistep ratio and percent problems. Examples: simple interest, tax, markups and markdowns, gratuities and commissions, fees, percent increase and decrease, percent error.',
        code: 'CCSS.Math.Content.7.RP.A.3'
      }),
      Ember.Object.create({
        description:
          'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10.',
        code: 'CCSS.Math.Content.5.NBT.A.2'
      })
    ]),
    isVisibleOnProfile: true
  });

  this.set('question', question);
  this.render(hbs`{{cards/qz-resource-card resource=question}}`);
  var $component = this.$(); //component dom element
  const $resourceCard = $component.find('.qz-resource-card');
  T.exists(
    assert,
    $resourceCard.find('.panel-heading h6.title'),
    'Missing Title'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-heading i.question-icon'),
    'Missing Question Icon'
  );
  assert.equal(
    T.text($resourceCard.find('.panel-heading .question-type span')),
    'Single Choice',
    'Incorrect question type'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-body .gru-taxonomy-tag-list'),
    'Missing standards'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-body .publisher img'),
    'Missing Publisher Image'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-body .publisher .owner a'),
    'Missing Owner Name'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-body .description p'),
    'Missing Description'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-footer button.copy-btn'),
    'Copy To Button Missing'
  );
  T.notExists(
    assert,
    $resourceCard.find('.panel-footer .visibility .pull-right'),
    'Missing visibility icon'
  );
  T.notExists(
    assert,
    $resourceCard.find('.panel-footer button.edit-btn'),
    'Edit Button should not be visible'
  );
  T.notExists(
    assert,
    $resourceCard.find('.panel-footer button.play-btn'),
    'Play Button should not be visible'
  );
});

test('Resource card trying buttons', function(assert) {
  assert.expect(4);

  var resource = ResourceModel.create({
    id: 1,
    title: 'Resource Title',
    format: 'video_resource',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    owner: Ember.Object.create({
      name: 'Publisher'
    }),
    standards: Ember.A([
      Ember.Object.create({
        description:
          'Use proportional relationships to solve multistep ratio and percent problems. Examples: simple interest, tax, markups and markdowns, gratuities and commissions, fees, percent increase and decrease, percent error.',
        code: 'CCSS.Math.Content.7.RP.A.3'
      }),
      Ember.Object.create({
        description:
          'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10.',
        code: 'CCSS.Math.Content.5.NBT.A.2'
      })
    ])
  });

  this.set('resource', resource);
  this.on('editResource', function(resource) {
    assert.equal(resource.get('id'), 1, 'Wrong resource id');
  });
  this.on('playResource', function(resource) {
    assert.equal(resource.get('id'), 1, 'Wrong resource id');
  });

  this.render(
    hbs`{{cards/qz-resource-card resource=resource editEnabled=true onPlayResource='playResource' onEditResource='editResource' profileService=profileService}}`
  );
  var $component = this.$(); //component dom element
  const $resourceCard = $component.find('.qz-resource-card');
  T.exists(
    assert,
    $resourceCard.find('.panel-footer button.edit-btn'),
    'Edit Button should be visible'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-footer button.play-btn'),
    'Play Button should be visible'
  );
  $resourceCard.find('.panel-footer button.edit-btn').click();
  $resourceCard.find('.panel-footer button.play-btn').click();
});
test('Resource Card with publisher', function(assert) {
  var resource = ResourceModel.create({
    title: 'Resource Title',
    format: 'video_resource',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    owner: Ember.Object.create({
      firstName: 'Publisher'
    }),
    standards: Ember.A([
      Ember.Object.create({
        description:
          'Use proportional relationships to solve multistep ratio and percent problems. Examples: simple interest, tax, markups and markdowns, gratuities and commissions, fees, percent increase and decrease, percent error.',
        code: 'CCSS.Math.Content.7.RP.A.3'
      }),
      Ember.Object.create({
        description:
          'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10.',
        code: 'CCSS.Math.Content.5.NBT.A.2'
      })
    ]),
    isPublished: true,
    publisher: 'Publisher name'
  });

  this.set('resource', resource);
  this.render(hbs`{{cards/qz-resource-card resource=resource}}`);
  var $component = this.$(); //component dom element
  const $resourceCard = $component.find('.qz-resource-card');
  T.notExists(
    assert,
    $resourceCard.find('.panel-body .publisher img'),
    'Publisher should not have image'
  );
  T.notExists(
    assert,
    $resourceCard.find('.panel-body .publisher .publisher-name a'),
    'The publisher name should not be a link'
  );
  T.exists(
    assert,
    $resourceCard.find('.panel-body .publisher .publisher-name'),
    'Missing publisher Name'
  );
});
