import { moduleFor, test } from 'ember-qunit';

moduleFor(
  'serializer:resource/resource',
  'Unit | Serializer | resource/resource'
);

test('normalizeReadResource', function(assert) {
  const serializer = this.subject();
  const resourceData = {
    id: 'resource-id',
    isResource: false,
    metadata: {
      title: 'question-title',
      thumbnail: 'question-thumbnail',
      type: 'singleChoice',
      display_guide: {
        is_broken: 1,
        is_frame_breaker: 0
      },
      correctAnswer: [
        {
          value: 'a'
        }
      ],
      body: 'question-body',
      description: 'question-description',
      interaction: {
        isShuffle: false,
        maxChoices: 1,
        prompt: 'question-prompt',
        choices: [
          {
            text: 'answer0-text',
            isFixed: false,
            value: 'answer0-value'
          },
          {
            text: 'answer1-text',
            isFixed: false,
            value: 'answer1-value'
          }
        ]
      },
      narration: 'narration-test',
      ownerId: 'owner-test'
    }
  };
  const resource = serializer.normalizeReadResource(resourceData);
  assert.equal(resource.get('id'), 'resource-id', 'Wrong id');
  assert.equal(resource.get('title'), 'question-title', 'Wrong title');
  assert.equal(resource.get('narration'), 'narration-test', 'Wrong narration');
  assert.equal(resource.get('ownerId'), 'owner-test', 'Wrong owner');
  assert.equal(
    resource.get('thumbnail'),
    'question-thumbnail',
    'Wrong thumbnail'
  );
  assert.equal(resource.get('displayGuide'), true, 'Wrong displayGuide');
  assert.equal(resource.get('type'), 'singleChoice', 'Wrong type');
  assert.notOk(resource.get('isResource'), 'Wrong value for isResource');
  assert.deepEqual(
    resource.get('correctAnswer'),
    [{ value: 'a' }],
    'Wrong correctAnswer'
  );
  assert.equal(resource.get('body'), 'question-body', 'Wrong body');
  assert.equal(
    resource.get('description'),
    'question-description',
    'Wrong description'
  );
  assert.notOk(resource.get('shuffle'), 'Wrong value for shuffle');
  assert.equal(resource.get('maxChoices'), 1, 'Wrong maxChoices');
  assert.equal(resource.get('prompt'), 'question-prompt', 'Wrong maxChoices');
  assert.equal(resource.get('answers').length, 2, 'Wrong answers length');
  resource.get('answers').forEach(function(answer, index) {
    assert.equal(
      answer.get('text'),
      `answer${index}-text`,
      `Wrong answer ${index} text`
    );
    assert.equal(
      answer.get('value'),
      `answer${index}-value`,
      `Wrong answer ${index} value`
    );
    assert.notOk(answer.get('isFixed'), 'Wrong answer ${index} isFixed');
  });
  assert.ok(
    resource.get('mediaUrl'),
    'Media Url does not set when thumbnail field is not null'
  );
});

test('normalizeReadResource without interaction', function(assert) {
  const serializer = this.subject();
  const resource = {
    id: 'resource-without-interaction',
    isResource: false,
    metadata: {
      title: 'question-title',
      type: 'singleChoice',
      correctAnswer: [
        {
          value: 'a'
        }
      ],
      body: 'question-body'
    }
  };
  const newResource = serializer.normalizeReadResource(resource);
  assert.equal(
    newResource.get('id'),
    'resource-without-interaction',
    'Wrong id'
  );
  assert.equal(newResource.get('title'), 'question-title', 'Wrong title');
  assert.equal(newResource.get('thumbnail'), null, 'Wrong thumbnail');
  assert.equal(newResource.get('type'), 'singleChoice', 'Wrong type');
  assert.notOk(newResource.get('isResource'), 'Wrong value for isResource');
  assert.deepEqual(
    newResource.get('correctAnswer'),
    [{ value: 'a' }],
    'Wrong correctAnswer'
  );
  assert.equal(newResource.get('body'), 'question-body', 'Wrong body');
  assert.equal(newResource.get('description'), null, 'Wrong description');
  assert.notOk(newResource.get('shuffle'), 'Wrong value for shuffle');
  assert.equal(newResource.get('maxChoices'), 0, 'Wrong maxChoices');
  assert.notOk(newResource.get('prompt'), 'Wrong maxChoices');
  assert.notOk(newResource.get('answers').length, 'Wrong answers length');
});

test('normalizeReadResource from Nile', function(assert) {
  const serializer = this.subject();
  const resource = {
    id: 'resource-nile',
    title: 'resource-title',
    content_subformat: 'webpage_resource',
    url: 'resource-body',
    metadata: {}
  };
  const newResource = serializer.normalizeReadResource(resource);
  assert.equal(newResource.get('id'), 'resource-nile', 'Wrong id');
  assert.equal(newResource.get('title'), 'resource-title', 'Wrong title');
  assert.equal(newResource.get('thumbnail'), null, 'Wrong thumbnail');
  assert.equal(newResource.get('type'), 'webpage_resource', 'Wrong type');
  assert.notOk(newResource.get('isResource'), 'Wrong value for isResource');
  assert.notOk(newResource.get('correctAnswer'), 'Wrong correctAnswer');
  assert.equal(newResource.get('body'), 'resource-body', 'Wrong body');
  assert.equal(newResource.get('description'), null, 'Wrong description');
  assert.notOk(newResource.get('answers').length, 'Wrong answers length');
});

test('normalizeReadResource Question Open Ended with rubric', function(assert) {
  const serializer = this.subject();
  const resourceData = {
    id: 'd60beb17-a9b6-4189-ad57-e39cd8586b18',
    isResource: false,
    sequence: 4,
    metadata: {
      title: 'Free response!',
      description: 'Enter your response',
      type: 'extended_text',
      body: 'Enter your response',
      ownerId: '874b47a1-c226-47f6-90a3-be5731551706'
    },
    rubric: {
      id: 'cca382f4-248b-4fb7-82a0-dbee0108f116',
      title: 'JCZ Rubric',
      url:
        'https://pbs.twimg.com/profile_images/553328508173172737/I6-Xy7rw.png',
      gradingType: 'self',
      tenant: 'ba956a97-ae15-11e5-a302-f8a963065976',
      creatorId: '874b47a1-c226-47f6-90a3-be5731551706',
      createdAt: 'Aug 3, 2017 3:54:04 PM',
      modifierId: '874b47a1-c226-47f6-90a3-be5731551706',
      updatedAt: 'Aug 7, 2017 2:13:55 PM',
      publishStatus: 'unpublished',
      categories: [
        {
          title: 'Test Category',
          level: false,
          scoring: false,
          requiredFeedback: true,
          levels: [
            {
              name: 'Best',
              score: 1.0
            },
            {
              name: 'Worst',
              score: 0.0
            }
          ]
        }
      ],
      isRemote: false,
      isRubric: true,
      overallFeedbackRequired: true
    }
  };
  const resource = serializer.normalizeReadResource(resourceData);
  assert.equal(resource.get('rubric.title'), 'JCZ Rubric', 'Incorrect Rubric');
  assert.equal(resource.get('rubric.categories').length, 1, 'Wrong categories');
  assert.equal(
    resource.get('rubric.categories')[0].get('levels').length,
    2,
    'Wrong Category Levels'
  );
});
