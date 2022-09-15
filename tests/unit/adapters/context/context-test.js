import Ember from 'ember';
import Pretender from 'pretender';
import { moduleFor, test } from 'ember-qunit';
import Configuration from 'quizzes-addon/config/env/test';

moduleFor('adapter:context/context', 'Unit | Adapter | context/context', {
  beforeEach: function() {
    this.pretender = new Pretender();
  },
  afterEach: function() {
    this.pretender.shutdown();
  }
});

test('createContext', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });

  const routes = function() {
    this.post(
      '/quizzes/api/v1/contexts',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({ id: '77d0c04b-b71a-485b-9573-9101cc288a0f' })
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };
  const data = {
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
  adapter
    .createContext(data)
    .then(response =>
      assert.deepEqual(
        response.id,
        '77d0c04b-b71a-485b-9573-9101cc288a0f',
        'Wrong response'
      )
    );
});
+test('getAssignedContextById', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedContextId = 'context-id';
  const routes = function() {
    this.get(
      '/quizzes/api/v1/contexts/context-id/assigned',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify([{ id: '77d0c04b-b71a-485b-9573-9101cc288a0f' }])
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };
  adapter
    .getAssignedContextById(expectedContextId)
    .then(response => assert.deepEqual(response.length, 1, 'Wrong response'));
});

test('getContextsAssigned', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const routes = function() {
    this.get(
      '/quizzes/api/v1/contexts/assigned',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify([{ id: '77d0c04b-b71a-485b-9573-9101cc288a0f' }])
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };
  adapter
    .getContextsAssigned()
    .then(response => assert.deepEqual(response.length, 1, 'Wrong response'));
});

test('getContextsCreated', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const routes = function() {
    this.get(
      '/quizzes/api/v1/contexts/created',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify([{ id: '77d0c04b-b71a-485b-9573-9101cc288a0f' }])
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };
  adapter
    .getContextsCreated()
    .then(response => assert.deepEqual(response.length, 1, 'Wrong response'));
});

test('moveToResource', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedContextId = 'context-id';
  const expectedResourceId = 'resource-id';
  const expectedEventContext = {
    eventSource: 'source'
  };
  const expectedPreviousResource = {
    id: 'id'
  };
  const expectedResponse = {};
  const routes = function() {
    this.post(
      '/quizzes/api/v1/contexts/context-id/onResource/resource-id',
      function(request) {
        const requestBodyJson = JSON.parse(request.requestBody);
        assert.deepEqual(
          requestBodyJson.previousResource,
          expectedPreviousResource,
          'Wrong previous resource'
        );
        assert.deepEqual(
          requestBodyJson.eventContext,
          expectedEventContext,
          'Wrong source value'
        );
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(expectedResponse)
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = function(verb, path) {
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  };

  adapter
    .moveToResource(
      expectedResourceId,
      expectedContextId,
      expectedPreviousResource,
      expectedEventContext
    )
    .then(response =>
      assert.deepEqual(response, expectedResponse, 'Wrong response')
    );
});

test('moveToResource no resource', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedContextId = 'context-id';
  const expectedResourceId = null;
  const expectedPreviousResource = {
    resourceId: 'id'
  };
  const expectedResponse = {};
  const routes = function() {
    this.post(
      '/quizzes/api/v1/contexts/context-id/onResource/id',
      function(request) {
        const requestBodyJson = JSON.parse(request.requestBody);
        assert.deepEqual(
          requestBodyJson.previousResource,
          expectedPreviousResource,
          'Wrong previous resource'
        );
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(expectedResponse)
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter
    .moveToResource(
      expectedResourceId,
      expectedContextId,
      expectedPreviousResource
    )
    .then(response =>
      assert.deepEqual(response, expectedResponse, 'Wrong response')
    );
});

test('moveToResource no previous resource', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedContextId = 'context-id';
  const expectedResourceId = 'resource-id';
  const expectedPreviousResource = null;
  const expectedResponse = {};
  const routes = function() {
    this.post(
      '/quizzes/api/v1/contexts/context-id/onResource/resource-id',
      function(request) {
        const requestBodyJson = JSON.parse(request.requestBody);
        assert.deepEqual(
          requestBodyJson.previousResource,
          {},
          'Wrong previous resource'
        );
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(expectedResponse)
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter
    .moveToResource(
      expectedResourceId,
      expectedContextId,
      expectedPreviousResource
    )
    .then(response =>
      assert.deepEqual(response, expectedResponse, 'Wrong response')
    );
});

test('sendStartContextEvent', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedContextId = 'context-id';
  const expectedEventContext = {
    eventSource: 'source'
  };
  const routes = function() {
    this.post(
      '/quizzes/api/v1/contexts/context-id/start',
      function(request) {
        const requestBodyJson = JSON.parse(request.requestBody);
        assert.deepEqual(
          requestBodyJson,
          expectedEventContext,
          'Wrong event context value'
        );
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter
    .sendStartContextEvent(expectedContextId, expectedEventContext)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
});

test('sendFinishContextEvent', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedContextId = 'context-id';
  const expectedEventContext = {
    eventSource: 'source'
  };
  const routes = function() {
    this.post(
      '/quizzes/api/v1/contexts/context-id/finish',
      function(request) {
        const requestBodyJson = JSON.parse(request.requestBody);
        assert.deepEqual(
          requestBodyJson,
          expectedEventContext,
          'Wrong event context value'
        );
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);

  adapter
    .sendFinishContextEvent(expectedContextId, expectedEventContext)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
});

test('updateContext', function(assert) {
  const adapter = this.subject({
    quizzesConfigurationService: Ember.Object.create({
      configuration: Ember.Object.create(Configuration)
    })
  });
  const expectedContextId = 'context-id';
  const routes = function() {
    this.put(
      '/quizzes/api/v1/contexts/context-id',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  };

  this.pretender.map(routes);
  this.pretender.unhandledRequest = (verb, path) =>
    assert.ok(false, `Wrong request [${verb}] url: ${path}`);
  const data = {
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
  adapter
    .updateContext(data, expectedContextId)
    .then(response => assert.deepEqual(response, {}, 'Wrong response'));
});
