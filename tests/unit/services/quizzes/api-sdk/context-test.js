import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';
import Context from 'quizzes-addon/models/context/context';
import Profile from 'quizzes-addon/models/profile/profile';

moduleForService(
  'service:quizzes/api-sdk/context',
  'Unit | Service | quizzes/api-sdk/context'
);

test('createContext', function(assert) {
  assert.expect(2);
  const service = this.subject();
  const assignment = Context.create({
    title: 'title',
    description: 'description',
    isActive: true,
    dueDate: 12340596,
    attempts: [{ id: 'attempt-1' }],
    learningObjective: 'learning objective'
  });
  const expectedData = {
    contextData: {
      contextMap: {},
      metadata: {
        title: 'title',
        description: 'description',
        isActive: true,
        dueDate: 12340596,
        attempts: [{ id: 'attempt-1' }],
        learningObjective: 'learning objective'
      }
    }
  };

  service.set(
    'contextAdapter',
    Ember.Object.create({
      createContext: function(data) {
        assert.equal(data, expectedData, 'Wrong adapter data');
        return Ember.RSVP.resolve();
      }
    })
  );
  service.set(
    'contextSerializer',
    Ember.Object.create({
      serializeContext: function(assignment) {
        assert.ok(assignment, 'Wrong assignment object');
        return expectedData;
      }
    })
  );

  const done = assert.async();
  service.createContext(assignment).then(done);
});

test('getAssignedContextById', function(assert) {
  assert.expect(3);
  const service = this.subject();
  const expectedResponse = {
    contextId: 'context-id',
    metadata: {
      title: 'title',
      description: 'description'
    },
    classId: 'class-id',
    collectionId: 'collection-id',
    isCollection: true,
    profileId: 'profile-id'
  };
  const expectedData = Context.create({
    id: 'context-id',
    title: 'title',
    description: 'description',
    classId: 'class-id',
    collectionId: 'collection-id',
    isCollection: true,
    profileId: 'profile-id'
  });

  service.set(
    'contextAdapter',
    Ember.Object.create({
      getAssignedContextById: function(contextId) {
        assert.equal(contextId, 'context-id', 'Wrong adapter');
        return Ember.RSVP.resolve([{ expectedResponse }]);
      }
    })
  );
  service.set(
    'contextSerializer',
    Ember.Object.create({
      normalizeReadContext: function(payload) {
        assert.deepEqual(
          payload,
          [{ expectedResponse }],
          'Wrong assignment object'
        );
        return expectedData;
      }
    })
  );

  const done = assert.async();
  service.getAssignedContextById('context-id').then(function(contextsAssigned) {
    assert.deepEqual(
      contextsAssigned,
      expectedData,
      'Wrong context assigned by id object'
    );
    done();
  });
});

test('getContextsCreated', function(assert) {
  assert.expect(3);
  const service = this.subject();
  const expectedResponse = {
    assignees: [
      {
        id: 'profile-id',
        firstName: 'user first name',
        lastName: 'user last name',
        username: 'username'
      },
      {
        id: 'profile-id1',
        firstName: 'user first name1',
        lastName: 'user last name1',
        username: 'username1'
      }
    ],
    contextData: {
      contextMap: {},
      metadata: {
        title: 'title',
        description: 'description',
        isActive: true,
        dueDate: 12340596,
        attempts: [{ id: 'attempt-1' }],
        learningObjective: 'learning objective'
      }
    }
  };
  const expectedData = [
    Context.create({
      title: 'title',
      description: 'description',
      isActive: true,
      dueDate: 12340596,
      attempts: [{ id: 'attempt-1' }],
      learningObjective: 'learning objective',
      assignees: [
        Profile.create({
          id: 'profile-id',
          firstName: 'user first name',
          lastName: 'user last name',
          username: 'username'
        }),
        Profile.create({
          id: 'profile-id1',
          firstName: 'user first name1',
          lastName: 'user last name1',
          username: 'username1'
        })
      ]
    })
  ];

  service.set(
    'contextAdapter',
    Ember.Object.create({
      getContextsCreated: function() {
        assert.ok(true, 'Wrong adapter');
        return Ember.RSVP.resolve([{ expectedResponse }]);
      }
    })
  );
  service.set(
    'contextSerializer',
    Ember.Object.create({
      normalizeReadContexts: function(payload) {
        assert.deepEqual(
          payload,
          [{ expectedResponse }],
          'Wrong assignment object'
        );
        return expectedData;
      }
    })
  );

  const done = assert.async();
  service.getContextsCreated().then(function(contextsCreated) {
    assert.deepEqual(
      contextsCreated,
      expectedData,
      'Wrong contexts created object'
    );
    done();
  });
});
test('getContextsAssigned', function(assert) {
  assert.expect(3);
  const service = this.subject();
  const expectedResponse = {
    contextData: {
      contextMap: {},
      metadata: {
        title: 'title',
        description: 'description',
        isActive: true,
        dueDate: 12340596
      }
    }
  };
  const expectedData = [
    Context.create({
      title: 'title',
      description: 'description',
      isActive: true,
      dueDate: 12340596,
      assignees: []
    })
  ];

  service.set(
    'contextAdapter',
    Ember.Object.create({
      getContextsAssigned: function() {
        assert.ok(true, 'Wrong adapter');
        return Ember.RSVP.resolve([{ expectedResponse }]);
      }
    })
  );
  service.set(
    'contextSerializer',
    Ember.Object.create({
      normalizeReadContexts: function(payload) {
        assert.deepEqual(
          payload,
          [{ expectedResponse }],
          'Wrong assignment object'
        );
        return expectedData;
      }
    })
  );

  const done = assert.async();
  service.getContextsAssigned().then(function(contextsAssigned) {
    assert.deepEqual(
      contextsAssigned,
      expectedData,
      'Wrong contexts assigned object'
    );
    done();
  });
});

test('moveToResource', function(assert) {
  const service = this.subject();
  const expectedContextId = 'context-id';
  const expectedResourceId = 'resource-id';
  const previousResult = {
    id: 'result-id'
  };
  const expectedEventContext = {
    eventSource: 'source',
    pathId: 1,
    collectionSubType: 'pre-test'
  };

  assert.expect(7);

  service.set(
    'contextAdapter',
    Ember.Object.create({
      moveToResource: function(resourceId, contextId, previous, eventContext) {
        assert.deepEqual(
          resourceId,
          expectedResourceId,
          'The resource id should match'
        );
        assert.deepEqual(
          contextId,
          expectedContextId,
          'The context id should match'
        );
        assert.deepEqual(
          previous,
          previousResult,
          'The previous result should match'
        );
        assert.deepEqual(
          eventContext,
          expectedEventContext,
          'The event context should match'
        );
        return Ember.RSVP.resolve(previousResult);
      }
    })
  );

  service.set(
    'contextSerializer',
    Ember.Object.create({
      serializeResourceResult: function(result) {
        assert.deepEqual(
          result,
          previousResult,
          'The resource result should match'
        );
        return previousResult;
      },
      serializeEventContext: function(eventContext) {
        assert.deepEqual(
          eventContext,
          expectedEventContext,
          'Wrong event context value'
        );
        return expectedEventContext;
      }
    })
  );

  const done = assert.async();
  service
    .moveToResource(
      expectedResourceId,
      expectedContextId,
      previousResult,
      expectedEventContext
    )
    .then(function(result) {
      assert.deepEqual(result, previousResult, 'The result should match');
      done();
    });
});

test('startContext', function(assert) {
  assert.expect(5);
  const service = this.subject();
  const expectedContextId = 'context-id';
  const contextResult = {
    id: 'result-id'
  };
  const expectedEventContext = {
    eventSource: 'source',
    pathId: 1,
    collectionSubType: 'pre-test'
  };

  service.set(
    'contextAdapter',
    Ember.Object.create({
      sendStartContextEvent: function(contextId, eventContext) {
        assert.deepEqual(
          contextId,
          expectedContextId,
          'The context id should match'
        );
        assert.deepEqual(
          eventContext,
          expectedEventContext,
          'The event context should match'
        );
        return Ember.RSVP.resolve(contextResult);
      }
    })
  );

  service.set(
    'contextSerializer',
    Ember.Object.create({
      normalizeContextResult: function(response) {
        assert.deepEqual(
          response,
          contextResult,
          'The context result should match'
        );
        return contextResult;
      },
      serializeEventContext: function(eventContext) {
        assert.deepEqual(
          eventContext,
          expectedEventContext,
          'Wrong event context value'
        );
        return expectedEventContext;
      }
    })
  );

  const done = assert.async();
  service
    .startContext(expectedContextId, expectedEventContext)
    .then(function(result) {
      assert.deepEqual(result, contextResult, 'The result should match');
      done();
    });
});

test('finishContext', function(assert) {
  assert.expect(4);
  const service = this.subject();
  const expectedContextId = 'context-id';
  const assessmentResult = {
    id: 'result-id'
  };
  const expectedEventContext = {
    eventSource: 'source',
    pathId: 1,
    collectionSubType: 'pre-test'
  };

  service.set(
    'contextAdapter',
    Ember.Object.create({
      sendFinishContextEvent: function(contextId, eventContext) {
        assert.deepEqual(
          contextId,
          expectedContextId,
          'The context id should match'
        );
        assert.deepEqual(
          eventContext,
          expectedEventContext,
          'The event context should match'
        );
        return Ember.RSVP.resolve(assessmentResult);
      }
    })
  );

  service.set(
    'contextSerializer',
    Ember.Object.create({
      serializeEventContext: function(eventContext) {
        assert.deepEqual(
          eventContext,
          expectedEventContext,
          'Wrong event context value'
        );
        return expectedEventContext;
      }
    })
  );

  const done = assert.async();
  service
    .finishContext(expectedContextId, expectedEventContext)
    .then(function(result) {
      assert.deepEqual(result, assessmentResult, 'The result should match');
      done();
    });
});

test('updateContext', function(assert) {
  assert.expect(2);
  const service = this.subject();
  const assignment = Context.create({
    title: 'title',
    description: 'description',
    isActive: true,
    dueDate: '12340596',
    createdDate: '12340596',
    modifiedDate: '12340596',
    assignees: Ember.A([
      Profile.create({
        id: 'profile-id',
        firstName: 'user first name',
        lastName: 'user last name',
        username: 'username'
      }),
      Profile.create({
        id: 'profile-id1',
        firstName: 'user first name1',
        lastName: 'user last name1',
        username: 'username1'
      })
    ])
  });
  const expectedData = {
    assignees: [
      {
        id: 'profile-id',
        firstName: 'user first name',
        lastName: 'user last name',
        username: 'username'
      },
      {
        id: 'profile-id1',
        firstName: 'user first name1',
        lastName: 'user last name1',
        username: 'username1'
      }
    ],
    contextData: {
      contextMap: {},
      metadata: {}
    },
    externalCollectionId: 'string',
    owner: {
      firstName: 'string',
      id: 'string',
      lastName: 'string',
      username: 'string'
    }
  };

  service.set(
    'contextAdapter',
    Ember.Object.create({
      updateContext: function(data) {
        assert.equal(data, expectedData, 'Wrong adapter data');
        return Ember.RSVP.resolve();
      }
    })
  );

  const expectedAssigneesList = [
    Profile.create({
      id: 'profile-id',
      firstName: 'user first name',
      lastName: 'user last name',
      username: 'username'
    }),
    Profile.create({
      id: 'profile-id1',
      firstName: 'user first name1',
      lastName: 'user last name1',
      username: 'username1'
    })
  ];

  service.set(
    'contextSerializer',
    Ember.Object.create({
      serializeUpdateContext: function(assignment) {
        assert.deepEqual(
          assignment.assignees,
          expectedAssigneesList,
          'Wrong assignees list object'
        );
        return expectedData;
      }
    })
  );

  const done = assert.async();
  service.updateContext(assignment).then(done);
});
