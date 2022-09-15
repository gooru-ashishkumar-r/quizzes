import Ember from 'ember';
import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Collection from 'quizzes-addon/models/collection/collection';
import Resource from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';
import ReportData from 'quizzes-addon/models/result/report-data';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';

moduleForComponent(
  'reports/class-assessment/qz-table-view',
  'Integration | Component | reports/class assessment/qz table view',
  {
    integration: true,
    beforeEach: function() {
      this.inject.service('i18n');
    }
  }
);

skip('it renders', function(assert) {
  const collection = Collection.create({
    id: 'collection-id',
    resources: [
      Resource.create({
        id: '56a120483b6e7b090501d3e7',
        sequence: 1
      }),
      Resource.create({
        id: '56a1204886b2e565e1b2c230',
        sequence: 3
      }),
      Resource.create({
        id: '56a12048ddee2022a741356a',
        sequence: 2
      })
    ]
  });

  const reportData = ReportData.create({
    collection,
    collectionId: collection.id,
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        profileName: 'student-name-1',
        profileCode: 'student-code-1',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 0,
            reaction: 1,
            savedTime: 1216
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            reaction: 2,
            savedTime: 2458
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 100,
            reaction: 3,
            savedTime: 1433
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        profileName: 'student-name-2',
        profileCode: 'student-code-2',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 0,
            reaction: 5,
            savedTime: 1216
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            reaction: 3,
            savedTime: 1433
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        profileName: 'student-name-3',
        profileCode: 'student-code-3',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 0,
            reaction: 1,
            savedTime: 1216
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a'
          })
        ])
      })
    ])
  });

  this.set('reportData', reportData);

  this.render(
    hbs`{{reports/class-assessment/qz-table-view reportData=reportData}}`
  );

  const $component = this.$('.reports.class-assessment.qz-table-view');
  assert.ok($component.length, 'Component classes');
  assert.equal(
    $component.find('.filters .checkbox').length,
    3,
    'Number of filter boxes'
  );
  assert.equal(
    $component.find('.filters .checkbox input[disabled]').length,
    1,
    'Filter boxes disabled'
  );
  assert.equal(
    $component.find('.filters .checkbox .correct').attr('disabled'),
    'disabled',
    'Score filter checkbox is disabled'
  );
  assert.ok(
    $component.find('.filters .checkbox .correct').prop('checked'),
    'Score filter checkbox is checked by default'
  );

  const $table = $component.find('.gru-two-tier-header-table');
  const $firstTierHeader = $table.find('tr.first-tier');

  assert.equal(
    $firstTierHeader.find('th').length,
    4,
    'First tier: Number of header columns'
  );
  assert.equal(
    $firstTierHeader
      .find('th:eq(0)')
      .text()
      .trim(),
    this.get('i18n').t('reports.qz-table-view.totals').string,
    'First tier: First header is for aggregate values'
  );

  const $secondTierHeader = $table.find('tr.second-tier');
  assert.equal(
    $secondTierHeader.find('th').length,
    13,
    'Second tier: Total column headers'
  );
  assert.equal(
    $secondTierHeader.find('th.hidden').length,
    8,
    'Second tier: Hidden column headers'
  );
  assert.ok(
    $secondTierHeader.find('th:eq(0)').hasClass('row-header'),
    'Second tier: Row header present'
  );
  assert.ok(
    $secondTierHeader.find('th:eq(1)').hasClass('correct'),
    'Second tier: Question first column'
  );
  assert.ok(
    $secondTierHeader.find('th:eq(2)').hasClass('timeSpent'),
    'Second tier: Question second column'
  );
  assert.ok(
    $secondTierHeader.find('th:eq(3)').hasClass('reaction'),
    'Second tier: Question third column'
  );

  const $dataRows = $table.find('tr.data');
  assert.equal($dataRows.length, 3, 'Number of data rows');
});

skip('it triggers event when clicking on questions', function(assert) {
  assert.expect(3);
  const collection = Collection.create({
    id: 'collection-id',
    resources: [
      Resource.create({
        id: '56a120483b6e7b090501d3e7',
        sequence: 1
      }),
      Resource.create({
        id: '56a1204886b2e565e1b2c230',
        sequence: 3
      }),
      Resource.create({
        id: '56a12048ddee2022a741356a',
        sequence: 2
      })
    ]
  });

  const reportData = ReportData.create({
    collection,
    collectionId: collection.id,
    reportEvents: Ember.A([
      ReportDataEvent.create({
        profileId: '56983a9060a68052c1ed934c',
        profileName: 'student-name-1',
        profileCode: 'student-code-1',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 0,
            reaction: 1,
            savedTime: 1216
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            reaction: 2,
            savedTime: 2458
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a',
            score: 100,
            reaction: 3,
            savedTime: 1433
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a90fb01fecc328e2388',
        profileName: 'student-name-2',
        profileCode: 'student-code-2',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 0,
            reaction: 5,
            savedTime: 1216
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230',
            score: 100,
            reaction: 3,
            savedTime: 1433
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a'
          })
        ])
      }),
      ReportDataEvent.create({
        profileId: '56983a906596902edadedc7c',
        profileName: 'student-name-3',
        profileCode: 'student-code-3',
        resourceResults: Ember.A([
          QuestionResult.create({
            resourceId: '56a120483b6e7b090501d3e7',
            score: 0,
            reaction: 1,
            savedTime: 1216
          }),
          QuestionResult.create({
            resourceId: '56a1204886b2e565e1b2c230'
          }),
          QuestionResult.create({
            resourceId: '56a12048ddee2022a741356a'
          })
        ])
      })
    ])
  });

  let numClicks = 1;

  this.on('externalAction', function(itemId) {
    if (numClicks === 1) {
      assert.equal(itemId, '-1', 'First click: aggregate column selected');
    } else if (numClicks === 2) {
      assert.equal(
        itemId,
        '56a120483b6e7b090501d3e7',
        'Second click: first question selected'
      );
    } else {
      assert.equal(
        itemId,
        '56a1204886b2e565e1b2c230',
        'Second click: last question selected'
      );
    }
    numClicks += 1;
  });

  this.set('reportData', reportData);

  this.render(hbs`{{reports/class-assessment/qz-table-view
    reportData=reportData
    onSelectQuestion=(action 'externalAction')}}`);

  const $component = this.$('.qz-table-view');
  $component.find('.first-tier th:eq(0)').click();
  $component.find('.first-tier th:eq(1)').click();
  $component.find('.first-tier th:eq(3)').click();
});
