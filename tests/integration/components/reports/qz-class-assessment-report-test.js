import Ember from 'ember';
import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'dummy/tests/helpers/assert';
import Collection from 'quizzes-addon/models/collection/collection';
import Resource from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';
import ReportData from 'quizzes-addon/models/result/report-data';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';

moduleForComponent(
  'reports/qz-class-assessment-report',
  'Integration | Component | reports/qz class assessment report',
  {
    integration: true,

    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

skip('Default Layout', function(assert) {
  const collection = Collection.create({
    id: 'collection-id',
    isCollection: false,
    title: 'Sample Assessment Name',
    resources: [
      Resource.create({
        id: 'resource-1-id',
        sequence: 1,
        title: 'Resource 1'
      }),
      Resource.create({
        id: 'resource-2-id',
        sequence: 2,
        title: 'Resource 2'
      })
    ]
  });
  const reportData = ReportData.create({
    collection,
    collectionId: collection.id,
    contextId: 'context-id',
    reportEvents: Ember.A([
      ReportDataEvent.create({
        currentResourceId: 'resource-1-id',
        profileId: 'user-1-id',
        profileName: 'user-1-name',
        lastFirstName: 'user-1-name',
        profileCode: 'user-1-code',
        resourceResults: Ember.A([
          QuestionResult.create({
            correct: true,
            resourceId: 'resource-1-id',
            reaction: 2,
            savedTime: 701
          }),
          QuestionResult.create({
            correct: true,
            resourceId: 'resource-2-id',
            reaction: 4,
            savedTime: 1333
          })
        ])
      }),
      ReportDataEvent.create({
        currentResourceId: 'resource-1-id',
        profileId: 'user-2-id',
        profileName: 'user-2-name',
        lastFirstName: 'user-2-name',
        profileCode: 'user-2-code',
        resourceResults: Ember.A([
          QuestionResult.create({
            correct: true,
            resourceId: 'resource-1-id',
            reaction: 2,
            savedTime: 701
          }),
          QuestionResult.create({
            correct: true,
            resourceId: 'resource-2-id',
            reaction: 4,
            savedTime: 1333
          })
        ])
      })
    ])
  });

  this.set('reportData', reportData);
  this.render(hbs`{{reports/qz-class-assessment-report
    reportData=reportData
  }}`);
  const $component = this.$();
  // const $summary = $component.find('.qz-summary');
  //T.exists(assert, $summary, 'Missing question summary');

  const $viewContainer = $component.find('.view-container');
  // T.exists(assert, $viewContainer, 'Missing view container');
  // assert.ok(
  //   !$viewContainer.hasClass('table-view'),
  //   'Table view should not be selected by default'
  // );
  // assert.ok(
  //   $viewContainer.hasClass('student-view'),
  //   'Student view should be selected by default'
  // );

  T.exists(
    assert,
    $viewContainer.find('.gru-view-layout-picker'),
    'Missing gru view layout picker'
  );
  T.exists(assert, $viewContainer.find('.qz-table-view'), 'Missing table view');
  T.exists(
    assert,
    $viewContainer.find('.qz-student-view'),
    'Missing student view'
  );

  //click at the view layout picker - thumbnails view
  $viewContainer
    .find('.gru-view-layout-picker .view-option.thumbnails a')
    .click();
  assert.ok(
    !$viewContainer.hasClass('table-view'),
    'Table view should not be selected'
  );
  assert.ok(
    $viewContainer.hasClass('student-view'),
    'Student view should be selected'
  );

  //click at the view layout picker - list view
  $viewContainer.find('.gru-view-layout-picker .view-option.list a').click();
  assert.ok(
    $viewContainer.hasClass('table-view'),
    'Table view should be selected'
  );
  assert.ok(
    !$viewContainer.hasClass('student-view'),
    'Student view should not be selected'
  );
});
