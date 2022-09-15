import Ember from 'ember';
import { moduleForComponent, test, skip } from 'ember-qunit';
import Collection from 'quizzes-addon/models/collection/collection';
import Resource from 'quizzes-addon/models/resource/resource';
import ContextResult from 'quizzes-addon/models/result/context';
import QuestionResult from 'quizzes-addon/models/result/question';

moduleForComponent('player/qz-player', 'Unit | Component | player/qz player', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('submitAll on collection', function(assert) {
  assert.expect(7);
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    isCollection: true
  });
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );
  const sendAction = action =>
    assert.equal(action, 'onFinish', 'Should call onFinish action');
  const component = this.subject({
    contextResult,
    resourceResult: questionResult,
    onFinish: 'onFinish',
    sendAction,
    eventContext: 'eventContext',
    contextService: Ember.Object.create({
      finishContext: function(contextId, eventContext) {
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(eventContext, 'eventContext', 'Wrong event context');
        return Ember.RSVP.resolve();
      },
      moveToResource: function(
        resourceId,
        contextId,
        resourceResult,
        eventContext
      ) {
        assert.deepEqual(resourceId, null, 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
        assert.deepEqual(eventContext, 'eventContext', 'Wrong event context');
        return Ember.RSVP.resolve({ score: 100 });
      }
    })
  });

  Ember.run(function() {
    component.send('submitAll');
  });
});

test('submitAll on assessment', function(assert) {
  assert.expect(4);
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false
  });
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const component = this.subject({
    contextResult,
    resourceResult: questionResult,
    eventContext: 'eventContext',
    contextService: Ember.Object.create({
      moveToResource: function(
        resourceId,
        contextId,
        resourceResult,
        eventContext
      ) {
        assert.deepEqual(resourceId, null, 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
        assert.deepEqual(eventContext, 'eventContext', 'Wrong event context');
        return Ember.RSVP.resolve({ score: 100 });
      }
    })
  });
  component.send('submitAll');
});

skip('submitQuestion with next question available', function(assert) {
  assert.expect(10);
  const question = Resource.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #1'
  });
  const question2 = Resource.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #2',
    id: 'question-id'
  });
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    nextResource: function(q) {
      assert.deepEqual(q, question);
      return question2;
    }
  });
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const questionResult2 = QuestionResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      pending: true,
      startedAt: 'any-date'
    }
  );
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' },
      getResultByResourceId: function(resourceId) {
        assert.equal(
          resourceId,
          question2.get('id'),
          'Question ids should match'
        );
        return questionResult2;
      }
    }
  );
  const component = this.subject({
    resource: question,
    resourceResult: questionResult,
    contextResult,
    eventContext: 'eventContext',
    contextService: Ember.Object.create({
      moveToResource: function(
        resourceId,
        contextId,
        resourceResult,
        eventContext
      ) {
        assert.deepEqual(resourceId, 'question-id', 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
        assert.deepEqual(eventContext, 'eventContext', 'Wrong event context');
        return Ember.RSVP.resolve({ score: 100 });
      }
    })
  });

  Ember.run(function() {
    component.send('submitQuestion', question, questionResult);
  });

  assert.notOk(component.get('showReport'), 'showReport updated');
  assert.deepEqual(
    component.get('resource'),
    question2,
    'resource property updated'
  );
  assert.deepEqual(
    component.get('resourceId'),
    'question-id',
    'resourceId property updated'
  );
  assert.deepEqual(
    component.get('resourceResult'),
    questionResult2,
    'resourceResult property updated'
  );
});

test('submitQuestion with next question unavailable', function(assert) {
  assert.expect(5);
  const question = Resource.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #1'
  });
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    nextResource: function(q) {
      assert.deepEqual(q, question);
      return null;
    }
  });
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );

  const component = this.subject({
    resource: question,
    resourceResult: questionResult,
    contextResult,
    eventContext: 'eventContext',
    contextService: Ember.Object.create({
      moveToResource: function(
        resourceId,
        contextId,
        resourceResult,
        eventContext
      ) {
        assert.deepEqual(resourceId, null, 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
        assert.deepEqual(eventContext, 'eventContext', 'Wrong event context');
        return Ember.RSVP.resolve({ score: 100 });
      }
    })
  });
  Ember.run(function() {
    component.send('submitQuestion', question);
  });
});

skip('previousResource', function(assert) {
  assert.expect(7);
  const question1 = Resource.create({
    id: '1',
    type: 'hot_text_word',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true
  });

  const question2 = Resource.create({
    id: '2',
    type: 'hot_text_word',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true
  });

  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    resources: Ember.A([question1, question2]),
    settings: {
      bidirectional: true
    }
  });

  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );

  const resourceResults = Ember.A([
    Resource.create({ resource: question1, resourceId: '1' }),
    Resource.create({ resource: question2, resourceId: '2' })
  ]);

  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      currentResource: question2,
      context: { id: 'context-id', attempts: '2' },
      resourceResults
    }
  );
  const component = this.subject({
    resourceResult: questionResult,
    contextResult,
    resource: question2,
    resourceId: '2',
    eventContext: 'eventContext',
    contextService: Ember.Object.create({
      moveToResource: function(
        resourceId,
        contextId,
        resourceResult,
        eventContext
      ) {
        assert.deepEqual(resourceId, '1', 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
        assert.deepEqual(eventContext, 'eventContext', 'Wrong event context');
        return Ember.RSVP.resolve({ score: 100 });
      }
    })
  });

  Ember.run(function() {
    component.send('previousResource', question2);
  });

  assert.notOk(component.get('showPrevious'), 'showPrevious should be false');
  assert.deepEqual(
    component.get('resource'),
    question1,
    'resource property updated'
  );
  assert.deepEqual(
    component.get('resourceId'),
    '1',
    'resourceId property updated'
  );
});

skip('selectNavigatorItem', function(assert) {
  assert.expect(9);
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false
  });
  const question = Resource.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #2',
    id: 'question-id'
  });
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const questionResult2 = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' },
      getResultByResourceId: function(resourceId) {
        assert.equal(
          resourceId,
          question.get('id'),
          'Question ids should match'
        );
        return questionResult;
      }
    }
  );
  const component = this.subject({
    resourceResult: questionResult2,
    contextResult,
    eventContext: 'eventContext',
    contextService: Ember.Object.create({
      moveToResource: function(
        resourceId,
        contextId,
        resourceResult,
        eventContext
      ) {
        assert.deepEqual(resourceId, 'question-id', 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(
          resourceResult,
          questionResult2,
          'Wrong result object'
        );
        assert.deepEqual(eventContext, 'eventContext', 'Wrong event context');
        return Ember.RSVP.resolve({ score: 100 });
      }
    })
  });

  Ember.run(function() {
    component.send('selectNavigatorItem', question);
  });

  assert.notOk(component.get('showReport'), 'showReport updated');
  assert.deepEqual(
    component.get('resource'),
    question,
    'resource property updated'
  );
  assert.deepEqual(
    component.get('resourceId'),
    'question-id',
    'resourceId property updated'
  );
  assert.deepEqual(
    component.get('resourceResult'),
    questionResult,
    'resourceResult property updated'
  );
});

test('changeEmotion', function(assert) {
  assert.expect(1);
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false
  });
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );
  const component = this.subject({
    resourceResult: questionResult,
    contextResult
  });
  const emotion = 'emotion';
  component.send('changeEmotion', emotion);
  assert.equal(
    questionResult.get('reaction'),
    'emotion',
    'reactionType should be updated'
  );
});

test('isNavigationDisabled', function(assert) {
  assert.expect(2);
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    settings: {
      bidirectional: true
    }
  });
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );
  const component = this.subject({
    resourceResult: questionResult,
    contextResult
  });

  assert.equal(
    component.get('isNavigationDisabled'),
    false,
    'Navigation should not be disabled'
  );

  const collection2 = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    settings: {
      bidirectional: false
    }
  });
  component.set('collection', collection2);
  assert.equal(
    component.get('isNavigationDisabled'),
    true,
    'Navigation should be disabled'
  );
});

test('showFeedback', function(assert) {
  assert.expect(2);
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    settings: {
      showFeedback: 'immediate'
    }
  });
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );
  const component = this.subject({
    resourceResult: questionResult,
    contextResult
  });

  assert.equal(
    component.get('showFeedback'),
    true,
    'Show feedback should be true'
  );

  const collection2 = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    settings: {
      showFeedback: 'never'
    }
  });
  component.set('collection', collection2);
  assert.equal(
    component.get('showFeedback'),
    false,
    'Should not show feedback'
  );
});
test('showPrevious', function(assert) {
  assert.expect(4);
  const question1 = Resource.create({
    id: '1',
    type: 'hot_text_word',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true
  });

  const question2 = Resource.create({
    id: '2',
    type: 'hot_text_word',
    body: 'The sun is yellow and the moon white',
    description: 'Sample description text',
    sequence: 1,
    hasAnswers: true
  });

  let collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    resources: Ember.A([question1, question2]),
    settings: {
      bidirectional: true
    }
  });

  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );
  const component = this.subject({
    resourceResult: questionResult,
    contextResult,
    resource: question1
  });

  assert.equal(
    component.get('showPrevious'),
    false,
    'Previous should not appear'
  );

  component.set('resource', question2);
  assert.equal(component.get('showPrevious'), true, 'Previous should appear');

  //Disabled navigation setting
  const collection2 = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    settings: {
      bidirectional: false
    }
  });
  component.set('collection', collection2);
  assert.equal(
    component.get('showPrevious'),
    false,
    'Previous should not appear'
  );

  //Disabled navigation setting
  collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: true,
    settings: {
      bidirectional: true
    }
  });
  component.set('collection', collection);
  assert.equal(
    component.get('showPrevious'),
    false,
    'Previous should not appear'
  );
});

test('isNotIframeUrl', function(assert) {
  const resource = Resource.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Question #1',
    displayGuide: true
  });

  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    nextResource: function(q) {
      assert.deepEqual(q, resource);
      return null;
    }
  });
  const questionResult = QuestionResult.create(
    Ember.getOwner(this).ownerInjection()
  );
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );

  const component = this.subject({
    resource: resource,
    resourceResult: questionResult,
    contextResult,
    contextService: Ember.Object.create({
      moveToResource: function(resourceId, contextId, resourceResult) {
        assert.deepEqual(resourceId, null, 'Wrong resource id');
        assert.deepEqual(contextId, 'context', 'Wrong context id');
        assert.deepEqual(resourceResult, questionResult, 'Wrong result object');
        return Ember.RSVP.resolve({ score: 100 });
      }
    })
  });
  assert.equal(
    component.get('isNotIframeUrl'),
    true,
    'isNotIframeUrl should be true'
  );
});
