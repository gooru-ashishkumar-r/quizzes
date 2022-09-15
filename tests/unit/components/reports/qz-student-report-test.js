import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import QuestionResult from 'quizzes-addon/models/result/question';
import ReportDataEvent from 'quizzes-addon/models/result/report-data-event';
import Collection from 'quizzes-addon/models/collection/collection';
import Resource from 'quizzes-addon/models/resource/resource';

moduleForComponent(
  'reports/qz-student-report',
  'Unit | Component | reports/qz student report',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  }
);
test('contextResult', function(assert) {
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
  const attemptData = ReportDataEvent.create({
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
        savedTime: 701
      }),
      QuestionResult.create({
        correct: true,
        resourceId: 'resource-2-id',
        reaction: 4,
        savedTime: 1333
      })
    ])
  });
  const component = this.subject({
    attemptData
  });
  assert.deepEqual(
    component.get('contextResult.reportEvent'),
    attemptData,
    'Attempt Data should match'
  );
});

test('collection', function(assert) {
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
  const attemptData = ReportDataEvent.create({
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
        savedTime: 701
      }),
      QuestionResult.create({
        correct: true,
        resourceId: 'resource-2-id',
        reaction: 4,
        savedTime: 1333
      })
    ])
  });
  const component = this.subject({
    attemptData
  });
  assert.deepEqual(
    component.get('collection'),
    collection,
    'Collection should match'
  );
});

test('areAnswersHidden', function(assert) {
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
      showFeedback: 'never'
    }
  });
  const attemptData = ReportDataEvent.create({
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
        savedTime: 701
      }),
      QuestionResult.create({
        correct: true,
        resourceId: 'resource-2-id',
        reaction: 4,
        savedTime: 1333
      })
    ])
  });
  const component = this.subject({
    attemptData
  });
  assert.equal(
    component.get('areAnswersHidden'),
    true,
    'Answers should be hidden'
  );
});
