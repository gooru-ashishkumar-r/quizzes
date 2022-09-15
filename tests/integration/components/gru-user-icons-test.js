import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent(
  'gru-user-icons',
  'Integration | Component | gru user icons',
  {
    integration: true
  }
);

test('it renders all users when the number of users is less than the view threshold', function(
  assert
) {
  var users = [
    Ember.Object.create({
      user: Ember.Object.create({
        id: 1,
        firstName: 'Bobby',
        lastName: 'Fisher'
      })
    })
  ];

  this.set('users', users);

  this.render(hbs`{{gru-user-icons users=users viewThreshold=2}}`);

  const $component = this.$('.gru-user-icons');
  const $firstView = $component.find('.first-view');

  assert.ok($component, 'Component does not have the component class');
  assert.equal(
    $firstView.find('.user').length,
    1,
    'Incorrect number of users at first view'
  );
  assert.ok(
    !$firstView.find('.num-left').length,
    'User number indicator should not be present'
  );
  assert.ok(
    !$firstView.hasClass('clickable'),
    'First view container should not have class "clickable"'
  );
});

test('it renders all users when the number of users is equal to the view threshold', function(
  assert
) {
  const users = [
    Ember.Object.create({
      user: Ember.Object.create({
        id: 1,
        firstName: 'Bobby',
        lastName: 'Fisher'
      })
    }),
    Ember.Object.create({
      user: Ember.Object.create({
        id: 2,
        firstName: 'John',
        lastName: 'Doe'
      })
    })
  ];

  this.set('users', users);

  this.render(hbs`{{gru-user-icons users=users viewThreshold=2}}`);

  const $component = this.$('.gru-user-icons');
  const $firstView = $component.find('.first-view');

  assert.ok($component, 'Component does not have the component class');
  assert.equal(
    $firstView.find('.user').length,
    2,
    'Incorrect number of users at first view'
  );
  assert.ok(
    !$firstView.find('.num-left').length,
    'User number indicator should not be present'
  );
  assert.ok(
    !$firstView.hasClass('clickable'),
    'First view container should not have class "clickable"'
  );
});

test('it renders all users when the number of users is greater than the view threshold', function(
  assert
) {
  const users = [
    Ember.Object.create({
      user: Ember.Object.create({
        id: 1,
        firstName: 'Bobby',
        lastName: 'Fisher'
      })
    }),
    Ember.Object.create({
      user: Ember.Object.create({
        id: 2,
        firstName: 'John',
        lastName: 'Doe'
      })
    }),
    Ember.Object.create({
      user: Ember.Object.create({
        id: 3,
        firstName: 'Martha',
        lastName: 'Stewart'
      })
    }),
    Ember.Object.create({
      user: Ember.Object.create({
        id: 4,
        firstName: 'John',
        lastName: 'Fitzgerald'
      })
    })
  ];

  this.set('users', users);

  this.render(hbs`{{gru-user-icons users=users viewThreshold=3}}`);

  const $component = this.$('.gru-user-icons');
  assert.equal($component.find('.first-view .user').length, 2);
  assert.equal($component.find('.first-view .num-left').length, 1);
  assert.equal($component.find('.remaining .user').length, 4);
});

/* TODO
test('users are sorted first by state (active first), then ascending alphabetically by last name', function(assert) {

  const users = [
    Ember.Object.create({
      isActive: false,
        id: 1,
        firstName: "John",
        lastName: "Fitzgerald",
        fullName: "Fitzgerald, John"
    }),
    Ember.Object.create({
      isActive: false,
      id: 2,
      firstName: "Bobby",
      lastName: "Fisher",
      fullName: "Fisher, Bobby"
    }),
    Ember.Object.create({
      isActive: true,
      id: 3,
      firstName: "John",
      lastName: "Doe",
      fullName: "Doe, John"
    }),
    Ember.Object.create({
      isActive: false,
      id: 4,
      firstName: "Martha",
      lastName: "Stewart",
      fullName: "Stewart, Martha"
    }),
    Ember.Object.create({
      isActive: true,
      id: 5,
      firstName: "Bennie",
      lastName: "King",
      fullName: "King, Bennie"
    }),
    Ember.Object.create({
      isActive: true,
      id: 6,
      firstName: "Kennie",
      lastName: "Wong",
      fullName: "Wong, Kennie"
    })
  ];

  this.set('users', users);

  this.render(hbs`{{gru-user-icons users=users viewThreshold=3}}`);

  const $component = this.$('.gru-user-icons');
  const $firstViewSection = $component.find('.first-view');
  const $remainingSection = $component.find('.remaining');

  assert.equal($firstViewSection.find('.user').length, 2);
  assert.equal($firstViewSection.find('.user:eq(0) img').prop('title'), 'Doe, John', 'First name does not coincide on first section');
  assert.equal($firstViewSection.find('.user:eq(1) img').prop('title'), 'King, Bennie', 'Second name does not coincide on first section');

  assert.equal($remainingSection.find('.user:eq(0) img').prop('title'), 'Doe, John', 'First name does not coincide on remaining section');
  assert.equal($remainingSection.find('.user:eq(1) img').prop('title'), 'King, Bennie', 'Second name does not coincide on remaining section');
  assert.equal($remainingSection.find('.user:eq(2) img').prop('title'), 'Wong, Kennie', 'Third  name does not coincide on remaining section');
  assert.equal($remainingSection.find('.user:eq(3) img').prop('title'), 'Fitzgerald, John', 'Fourth  name does not coincide on remaining section');
  assert.equal($remainingSection.find('.user:eq(4) img').prop('title'), 'Fisher, Bobby', 'Fifth  name does not coincide on remaining section');
  assert.equal($remainingSection.find('.user:eq(5) img').prop('title'), 'Stewart, Martha', 'Sixth name does not coincide on remaining section');
});*/

//test('it opens/closes a tooltip to view more users when the number of users exceeds the view threshold', function(assert) {
//
//  const users = [
//    Ember.Object.create({
//      isActive: true,
//      id: 1,
//      firstName: "Bobby",
//      lastName: "Fisher"
//    }),
//    Ember.Object.create({
//      isActive: true,
//      id: 2,
//      firstName: "John",
//      lastName: "Doe"
//    }),
//    Ember.Object.create({
//      isActive: true,
//      id: 3,
//      firstName: "Martha",
//      lastName: "Stewart"
//    }),
//    Ember.Object.create({
//      isActive: true,
//      id: 4,
//      firstName: "John",
//      lastName: "Fitzgerald"
//    })
//  ];
//
//  this.set('users', users);
//
//  this.render(hbs`{{gru-user-icons users=users viewThreshold=3 viewMoreIn='tooltip'}}`);
//
//  const $component = this.$('.gru-user-icons');
//  const $anchor = $component.find('.first-view');
//  var $popover;
//
//  assert.ok($anchor.hasClass('clickable'), 'Anchor is missing class "clickable"');
//
//  // Open the tooltip
//  $anchor.click();
//  $popover = $component.find('.popover');
//  assert.ok($popover.length, 'Tooltip should be present');
//  assert.ok($popover.hasClass('in'), 'Tooltip should be visible');
//  assert.equal($popover.find('.popover-content .user').length, 2, 'Tooltip does not show the correct number of users');
//
//  // Close the tooltip
//  $anchor.click();
//  $popover = $component.find('.popover');
//  assert.ok(!$popover.length, 'Tooltip should have been hidden');
//});

// test('it opens/closes a modal to view more users when the number of users exceeds the view threshold', function(assert) {
//
//   const users = [
//     Ember.Object.create({
//       user: Ember.Object.create({
//         id: 1,
//         firstName: "Bobby",
//         lastName: "Fisher"
//       })
//     }),
//     Ember.Object.create({
//       user: Ember.Object.create({
//         id: 2,
//         firstName: "John",
//         lastName: "Doe"
//       })
//     }),
//     Ember.Object.create({
//       user: Ember.Object.create({
//         id: 3,
//         firstName: "Martha",
//         lastName: "Stewart"
//       })
//     }),
//     Ember.Object.create({
//       user: Ember.Object.create({
//         id: 4,
//         firstName: "John",
//         lastName: "Fitzgerald"
//       })
//     })
//   ];
//
//   this.set('users', users);
//
//   this.render(hbs`{{gru-user-icons users=users viewThreshold=3 viewMoreIn='modal'}}`);
//
//   const $component = this.$('.gru-user-icons');
//   const $anchor = $component.find('.first-view .pointer span');
//   const $modal = $component.find('.remaining.modal');
//   assert.ok($modal.length, 'Modal element should be present');
//   assert.ok(!$modal.hasClass('in'), 'Modal should not be visible');
//
//   // Open the modal
//   $anchor.click();
//
//   return wait().then(function () {
//     assert.ok($modal.hasClass('in'), 'Modal should be visible');
//     assert.equal($modal.find('.modal-body .user').length, 4, 'Modal does not show the correct number of users');
//     const $close = $component.find('.modal-header button.close');
//     // Close the modal
//     $close.click();
//     return wait().then(function () {
//       assert.ok(!$modal.hasClass('in'), 'Modal should have been hidden');
//     });
//   });
// });
