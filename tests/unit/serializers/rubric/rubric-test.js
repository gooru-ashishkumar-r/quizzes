import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('serializer:rubric/rubric', 'Unit | Serializer | rubric/rubric');

test('normalizeRubricCategory', function(assert) {
  const serializer = this.subject();

  const category = {
    title: 'Thesis and Sub-claims',
    feedback: 'any feedback',
    requiredFeedback: true,
    level: true,
    scoring: false,
    levels: [
      {
        name: 'Exemplary',
        score: 4
      },
      {
        name: 'Proficient',
        score: 3
      },
      {
        name: 'Basic',
        score: 2
      },
      {
        name: 'Below Basic',
        score: 1
      }
    ]
  };

  const rubricCategory = serializer.normalizeRubricCategory(category);
  assert.equal(
    rubricCategory.get('title'),
    'Thesis and Sub-claims',
    'Wrong title'
  );
  assert.equal(
    rubricCategory.get('feedbackGuidance'),
    'any feedback',
    'Wrong feedback'
  );
  assert.equal(
    rubricCategory.get('requiresFeedback'),
    true,
    'Wrong requiresFeedback'
  );
  assert.equal(rubricCategory.get('allowsLevels'), true, 'Wrong allowsLevels');
  assert.equal(
    rubricCategory.get('allowsScoring'),
    false,
    'Wrong allowsScoring'
  );
  assert.equal(rubricCategory.get('levels.length'), 4, 'Wrong allowsScoring');
  assert.equal(
    rubricCategory.get('levels')[0].name,
    'Exemplary',
    'Wrong level name'
  );
  assert.equal(rubricCategory.get('levels')[0].score, 4, 'Wrong level score');
});

test('normalizeRubric', function(assert) {
  const serializer = this.subject();
  const contentCdnUrl = 'content-url/';
  serializer.set(
    'session',
    Ember.Object.create({
      cdnUrls: {
        content: contentCdnUrl
      }
    })
  );

  const rubricData = {
    id: '2c185398-d0e6-42d8-9926-572939fc0784',
    title: 'Rubric - 1',
    description: 'This is the example question for the rubrics association',
    thumbnail: '2c185398-d0e6-42d8-9926-572939fc0784.png',
    publishDate: '2017-02-24T05:55:42Z',
    publishStatus: 'published',
    metadata: {
      audience: [12, 45]
    },
    taxonomy: {},
    url: 'https://en.wikipedia.org/wiki/Rubric_(academic)',
    isRemote: true,
    isRubric: false,
    feedback: 'Summarize your feedback on the essay as a whole',
    overallFeedbackRequired: true,
    categories: [
      {
        title: 'Thesis and Sub-claims'
      },
      {
        title: 'Thesis and Sub-claims'
      }
    ],
    createdAt: '2017-02-24T05:55:42Z',
    updatedAt: '2017-02-24T05:55:42Z',
    tenant: 'ba956a97-ae15-11e5-a302-f8a963065976',
    gradingType: 'teacher'
  };

  const rubric = serializer.normalizeRubric(rubricData);

  assert.equal(
    rubric.get('id'),
    '2c185398-d0e6-42d8-9926-572939fc0784',
    'Wrong id'
  );
  assert.equal(rubric.get('title'), 'Rubric - 1', 'Wrong title');
  assert.equal(
    rubric.get('description'),
    'This is the example question for the rubrics association',
    'Wrong description'
  );
  assert.equal(
    rubric.get('thumbnail'),
    `${contentCdnUrl}2c185398-d0e6-42d8-9926-572939fc0784.png`,
    'Wrong thumbnail'
  );
  assert.deepEqual(rubric.get('audience'), [12, 45], 'Wrong audience');
  assert.equal(rubric.get('standards.length'), 0, 'Wrong taxonomy');
  assert.equal(
    rubric.get('url'),
    'https://en.wikipedia.org/wiki/Rubric_(academic)',
    'Wrong url'
  );
  assert.notOk(rubric.get('uploaded'), 'Wrong uploaded value');
  assert.equal(
    rubric.get('feedback'),
    'Summarize your feedback on the essay as a whole',
    'Wrong feedback'
  );
  assert.equal(rubric.get('isPublished'), true, 'Should be published');
  assert.equal(
    rubric.get('publishDate'),
    '2017-02-24T05:55:42Z',
    'Incorrect publish date'
  );
  assert.equal(rubric.get('requiresFeedback'), true, 'Wrong requires feedback');
  assert.equal(rubric.get('categories.length'), 2, 'Wrong categories length');
  assert.equal(rubric.get('rubricOn'), false, 'Rubric should be off');
  assert.equal(rubric.get('grader'), 'teacher', 'Incorrect grader');
});

test('normalizeRubric with uploaded file', function(assert) {
  const serializer = this.subject();
  const contentCdnUrl = 'content-url/';
  serializer.set(
    'session',
    Ember.Object.create({
      cdnUrls: {
        content: contentCdnUrl
      }
    })
  );

  const rubricData = {
    id: '2c185398-d0e6-42d8-9926-572939fc0784',
    title: 'Rubric - 1',
    description: 'This is the example question for the rubrics association',
    thumbnail: '2c185398-d0e6-42d8-9926-572939fc0784.png',
    publishDate: '2017-02-24T05:55:42Z',
    publishStatus: 'published',
    metadata: {
      audience: [12, 45]
    },
    taxonomy: {},
    url: '2c185398-d0e6-42d8-9926-572939fc0784.pdf',
    isRemote: false,
    isRubric: true,
    feedback: 'Summarize your feedback on the essay as a whole',
    overallFeedbackRequired: true,
    categories: [
      {
        title: 'Thesis and Sub-claims'
      },
      {
        title: 'Thesis and Sub-claims'
      }
    ],
    createdAt: '2017-02-24T05:55:42Z',
    updatedAt: '2017-02-24T05:55:42Z',
    tenant: 'ba956a97-ae15-11e5-a302-f8a963065976',
    gradingType: 'teacher'
  };

  const rubric = serializer.normalizeRubric(rubricData);

  assert.equal(
    rubric.get('id'),
    '2c185398-d0e6-42d8-9926-572939fc0784',
    'Wrong id'
  );
  assert.equal(rubric.get('title'), 'Rubric - 1', 'Wrong title');
  assert.equal(
    rubric.get('description'),
    'This is the example question for the rubrics association',
    'Wrong description'
  );
  assert.equal(
    rubric.get('thumbnail'),
    `${contentCdnUrl}2c185398-d0e6-42d8-9926-572939fc0784.png`,
    'Wrong thumbnail'
  );
  assert.deepEqual(rubric.get('audience'), [12, 45], 'Wrong audience');
  assert.equal(rubric.get('standards.length'), 0, 'Wrong taxonomy');
  assert.equal(
    rubric.get('url'),
    `${contentCdnUrl}2c185398-d0e6-42d8-9926-572939fc0784.pdf`,
    'Wrong url'
  );
  assert.ok(rubric.get('uploaded'), 'Wrong uploaded value');
  assert.equal(
    rubric.get('feedback'),
    'Summarize your feedback on the essay as a whole',
    'Wrong feedback'
  );
  assert.ok(rubric.get('isPublished'), 'Should be published');
  assert.equal(
    rubric.get('publishDate'),
    '2017-02-24T05:55:42Z',
    'Incorrect publish date'
  );
  assert.ok(rubric.get('requiresFeedback'), 'Wrong requires feedback');
  assert.equal(rubric.get('categories.length'), 2, 'Wrong categories length');
  assert.ok(rubric.get('rubricOn'), 'Rubric should be on');
});
