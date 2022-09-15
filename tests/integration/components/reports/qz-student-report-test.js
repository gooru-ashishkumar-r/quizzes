import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Collection from 'quizzes-addon/models/collection/collection';
import Resource from 'quizzes-addon/models/resource/resource';
import QuestionResult from 'quizzes-addon/models/result/question';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';

moduleForComponent(
  'reports/qz-student-report',
  'Integration | Component | reports/qz student report',
  {
    integration: true
  }
);

test('Layout', function(assert) {
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

  this.set(
    'attemptData',
    ReportDataEvent.create({
      attemptId: 'attempt-id',
      collection,
      collectionId: collection.id,
      contextId: 'context-id',
      currentResourceId: 'resource-1-id',
      profileId: 'user-2-id',
      resourceResults: Ember.A([
        QuestionResult.create({
          correct: true,
          resourceId: 'resource-1-id',
          reaction: 2,
          savedTime: 701,
          resource: Resource.create({
            id: 'resource-1',
            sequence: 1,
            body: 'Resource 1',
            isResource: true
          })
        }),
        QuestionResult.create({
          correct: true,
          resourceId: 'resource-2-id',
          reaction: 4,
          savedTime: 1333,
          resource: Resource.create({
            id: 'resource-1',
            sequence: 4,
            body: 'Resource 1',
            isResource: true
          })
        })
      ])
    })
  );
  this.render(hbs`{{reports/qz-student-report attemptData=attemptData}}`);

  const $component = this.$('.reports.qz-student-report');
  assert.ok($component.length, 'Component');
  assert.ok(
    $component.find('.reports.qz-assessment-report').length,
    'Assessment report'
  );
});

test('Layout when show key setting', function(assert) {
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
    ],
    settings: {
      showKey: false
    }
  });

  this.set(
    'attemptData',
    ReportDataEvent.create({
      attemptId: 'attempt-id',
      collection,
      collectionId: collection.id,
      contextId: 'context-id',
      currentResourceId: 'resource-1-id',
      profileId: 'user-2-id',
      resourceResults: Ember.A([
        QuestionResult.create({
          correct: true,
          resourceId: 'resource-1-id',
          reaction: 2,
          savedTime: 701,
          resource: Resource.create({
            id: 'resource-1',
            sequence: 1,
            body: 'Resource 1',
            isResource: false
          })
        }),
        QuestionResult.create({
          correct: true,
          resourceId: 'resource-2-id',
          reaction: 4,
          savedTime: 1333,
          resource: Resource.create({
            id: 'resource-1',
            sequence: 3,
            body: 'Resource 1',
            isResource: false
          })
        })
      ])
    })
  );

  this.render(hbs`{{reports/qz-student-report attemptData=attemptData}}`);

  const $component = this.$('.reports.qz-assessment-report');
  assert.ok($component.length, 'Component');

  const collection2 = Collection.create({
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
    ],
    settings: {
      showKey: true
    }
  });

  this.set(
    'attemptData',
    ReportDataEvent.create({
      attemptId: 'attempt-id',
      collection: collection2,
      collectionId: collection2.id,
      contextId: 'context-id',
      currentResourceId: 'resource-1-id',
      profileId: 'user-2-id',
      resourceResults: Ember.A([
        QuestionResult.create({
          correct: true,
          resourceId: 'resource-1-id',
          reaction: 2,
          savedTime: 701,
          resource: Resource.create({
            id: 'resource-1',
            sequence: 1,
            body: 'Resource 1',
            isResource: false
          })
        }),
        QuestionResult.create({
          correct: true,
          resourceId: 'resource-2-id',
          reaction: 4,
          savedTime: 1333,
          resource: Resource.create({
            id: 'resource-1',
            sequence: 2,
            body: 'Resource 1',
            isResource: true
          })
        })
      ])
    })
  );

  assert.ok(
    $component.find('.qz-questions .questions-header .performance').length,
    'Performance button should appear'
  );
  assert.ok(
    $component.find('.qz-questions .questions-header .correct-answer').length,
    'Correct answer button should appear'
  );
});

test('Layout when teacher hidden the summary report', function(assert) {
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
    ],
    settings: {
      showKey: false
    }
  });

  this.set(
    'attemptData',
    ReportDataEvent.create({
      attemptId: 'attempt-id',
      collection,
      collectionId: collection.id,
      contextId: 'context-id',
      currentResourceId: 'resource-1-id',
      profileId: 'user-2-id',
      resourceResults: Ember.A([
        QuestionResult.create({
          correct: true,
          resourceId: 'resource-1-id',
          reaction: 2,
          savedTime: 701,
          resource: Resource.create({
            id: 'resource-1',
            sequence: 4,
            body: 'Resource 1',
            isResource: false
          })
        }),
        QuestionResult.create({
          correct: true,
          resourceId: 'resource-2-id',
          reaction: 4,
          savedTime: 1333,
          resource: Resource.create({
            id: 'resource-1',
            sequence: 4,
            body: 'Resource 1',
            isResource: false
          })
        })
      ])
    })
  );

  this.set('areAnswersHidden', true);

  this.render(
    hbs`{{reports/qz-student-report attemptData=attemptData areAnswersHidden=areAnswersHidden}}`
  );

  const $component = this.$('.reports.qz-assessment-report');
  assert.ok($component.length, 'Component');
  assert.notOk(
    $component.find('.gru-bubbles').length,
    'Questions bubbles should not appear'
  );
  assert.notOk(
    $component.find('.qz-questions').length,
    'Assessment report should not appear'
  );
  assert.ok(
    $component.find('.hidden-report').length,
    'Hidden report text should appear'
  );

  this.set('areAnswersHidden', false);
  assert.ok(
    $component.find('.gru-bubbles').length,
    'Questions bubbles should appear'
  );
  assert.ok(
    $component.find('.qz-questions').length,
    'Assessment report should appear'
  );
  assert.notOk(
    $component.find('.hidden-report').length,
    'Hidden report text should not appear'
  );
});
