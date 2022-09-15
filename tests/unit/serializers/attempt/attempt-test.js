import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:attempt/attempt', 'Unit | Serializer | attempt/attempt');

test('normalizeReportData', function(assert) {
  const serializer = this.subject();
  const payload = {
    contextId: 'context-id',
    collectionId: 'collection-id',
    profileAttempts: [
      {
        currentResourceId: 'current-resource-id',
        profileId: 'student-id-1',
        events: [
          {
            resourceId: 'resource-id-1',
            timeSpent: 10000,
            reaction: 1,
            answer: 'answer-1'
          },
          {
            resourceId: 'resource-id-2',
            timeSpent: 20000,
            reaction: 3,
            answer: 'answer-2'
          }
        ]
      },
      {
        currentResourceId: 'current-resource-id',
        profileId: 'student-id-2',
        profileCode: 'student-code-2',
        profileName: 'student-name-2',
        events: []
      }
    ]
  };
  const response = serializer.normalizeReportData(payload);
  assert.equal(
    response.get('contextId'),
    'context-id',
    'Wrong context id value'
  );
  assert.equal(
    response.get('collectionId'),
    'collection-id',
    'Wrong collection id value'
  );
  assert.equal(
    response.get('reportEvents').length,
    2,
    'Wrong resource results length'
  );
});

test('normalizeReportEvents', function(assert) {
  const serializer = this.subject();
  const payload = [
    {
      currentResourceId: 'current-resource-id',
      profileId: 'student-id-1',
      createdDate: 1,
      updatedDate: 3,
      eventSummary: {
        averageReaction: 3,
        averageScore: 66,
        totalAnswered: 3,
        totalCorrect: 2,
        totalTimeSpent: 52868
      },
      events: [
        {
          resourceId: 'resource-id-1',
          timeSpent: 10000,
          reaction: 1,
          answer: 'answer-1'
        },
        {
          resourceId: 'resource-id-2',
          timeSpent: 20000,
          reaction: 3,
          answer: 'answer-2'
        }
      ],
      isComplete: true
    },
    {
      createdDate: 2,
      updatedDate: 4,
      currentResourceId: 'current-resource-id',
      profileId: 'student-id-2',
      events: [],
      isComplete: false
    }
  ];
  const response = serializer.normalizeReportDataEvents(payload);
  assert.equal(response.length, 2, 'Wrong resource results length');
  assert.equal(
    response[0].get('currentResourceId'),
    'current-resource-id',
    'Wrong first current resource'
  );
  assert.equal(
    response[0].get('profileId'),
    'student-id-1',
    'Wrong first student id'
  );
  assert.equal(
    response[0].get('resourceResults').length,
    2,
    'Wrong first results length'
  );
  assert.equal(
    response[0].get('resourceResults')[0].get('resourceId'),
    'resource-id-1',
    'Wrong first resource id'
  );
  assert.equal(
    response[0].get('resourceResults')[1].get('resourceId'),
    'resource-id-2',
    'Wrong second resource id'
  );
  assert.equal(
    response[0].get('averageReaction'),
    3,
    'Wrong first average reaction'
  );
  assert.equal(
    response[0].get('submittedAt'),
    3,
    'Wrong first submitted at value'
  );
  assert.equal(
    response[0].get('averageScore'),
    66,
    'Wrong first average score'
  );
  assert.equal(
    response[0].get('totalAnswered'),
    3,
    'Wrong first total answered'
  );
  assert.equal(response[0].get('totalCorrect'), 2, 'Wrong first total correct');
  assert.equal(
    response[0].get('totalTimeSpent'),
    52868,
    'Wrong first total time spent'
  );
  assert.ok(
    response[0].get('isAttemptFinished'),
    'Wrong first is attempt finished'
  );
  assert.equal(
    response[1].get('currentResourceId'),
    'current-resource-id',
    'Wrong second current resource'
  );
  assert.equal(
    response[1].get('profileId'),
    'student-id-2',
    'Wrong second student id'
  );
  assert.equal(
    response[1].get('resourceResults').length,
    0,
    'Wrong second results length'
  );
  assert.equal(
    response[1].get('submittedAt'),
    4,
    'Wrong second submitted at value'
  );
  assert.equal(
    response[1].get('averageReaction'),
    0,
    'Wrong second average reaction'
  );
  assert.equal(
    response[1].get('averageScore'),
    0,
    'Wrong second average score'
  );
  assert.equal(
    response[1].get('totalAnswered'),
    0,
    'Wrong second total answered'
  );
  assert.equal(
    response[1].get('totalCorrect'),
    0,
    'Wrong second total correct'
  );
  assert.equal(
    response[1].get('totalTimeSpent'),
    0,
    'Wrong second total time spent'
  );
  assert.notOk(
    response[1].get('isAttemptFinished'),
    'Wrong second is attempt finished'
  );
});

test('normalizeReportEvent', function(assert) {
  const serializer = this.subject();
  const payload = {
    attemptId: 'attempt-id',
    collectionId: 'collection-id',
    contextId: 'context-id',
    currentResourceId: 'current-resource-id',
    profileId: 'student-id-1',
    createdDate: 1,
    updatedDate: 2,
    eventSummary: {
      averageReaction: 3,
      averageScore: 66,
      totalAnswered: 3,
      totalCorrect: 2,
      totalTimeSpent: 52868
    },
    taxonomySummary: [
      {
        taxonomyId: 'taxonomyId',
        averageScore: 100,
        resources: ['resource-id']
      }
    ],
    events: [
      {
        resourceId: 'resource-id-1',
        timeSpent: 10000,
        reaction: 1,
        answer: 'answer-1'
      },
      {
        resourceId: 'resource-id-2',
        timeSpent: 20000,
        reaction: 3,
        answer: 'answer-2'
      }
    ]
  };
  const response = serializer.normalizeReportDataEvent(payload);
  assert.equal(response.get('attemptId'), 'attempt-id', 'Wrong attempt id');
  assert.equal(
    response.get('collectionId'),
    'collection-id',
    'Wrong collection id'
  );
  assert.equal(response.get('contextId'), 'context-id', 'Wrong context id');
  assert.equal(
    response.get('currentResourceId'),
    'current-resource-id',
    'Wrong current resource'
  );
  assert.equal(response.get('profileId'), 'student-id-1', 'Wrong student id');
  assert.equal(
    response.get('resourceResults').length,
    2,
    'Wrong results length'
  );
  assert.equal(
    response.get('resourceResults')[0].get('resourceId'),
    'resource-id-1',
    'Wrong resource id'
  );
  assert.equal(
    response.get('resourceResults')[1].get('resourceId'),
    'resource-id-2',
    'Wrong resource id'
  );
  assert.equal(response.get('submittedAt'), 2, 'Wrong submitted at value');
  assert.equal(response.get('averageReaction'), 3, 'Wrong average reaction');
  assert.equal(response.get('averageScore'), 66, 'Wrong average score');
  assert.equal(response.get('totalAnswered'), 3, 'Wrong total answered');
  assert.equal(response.get('totalCorrect'), 2, 'Wrong total correct');
  assert.equal(response.get('totalTimeSpent'), 52868, 'Wrong total time spent');
  assert.equal(
    response.get('mastery').length,
    1,
    'Wrong total learning target'
  );
  assert.equal(
    response.get('mastery')[0].get('id'),
    'taxonomyId',
    'Wrong learning target id'
  );
  assert.equal(
    response.get('mastery')[0].get('mastery'),
    100,
    'Wrong learning target score'
  );
  assert.equal(
    response.get('mastery')[0].get('relatedQuestions').length,
    1,
    'Wrong learning target related questions'
  );
  assert.equal(
    response.get('mastery')[0].get('relatedQuestions')[0],
    'resource-id',
    'Wrong learning target related question id'
  );
});

test('normalizeAttemptIds', function(assert) {
  const serializer = this.subject();
  const attempts = ['attempt-id1', 'attempt-id2', 'attempt-id3', 'attempt-id4'];
  const payload = { attempts };
  const response = serializer.normalizeAttemptIds(payload);
  assert.deepEqual(response, attempts, 'Wrong attempt values');
});
