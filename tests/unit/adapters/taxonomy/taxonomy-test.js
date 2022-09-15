import { test } from 'ember-qunit';
import moduleForAdapter from 'dummy/tests/helpers/module-for-adapter';

moduleForAdapter(
  'adapter:taxonomy/taxonomy',
  'Unit | Adapter | taxonomy/taxonomy',
  {
    // needs: []
  }
);

test('Fetch Taxonomy Subjects for K-12', function(assert) {
  const adapter = this.subject();
  this.pretender.map(function() {
    this.get(
      '/api/nucleus/v1/taxonomy/subjects',
      function(request) {
        assert.equal(
          request.queryParams.classification_type,
          'k_12',
          'Wrong classification type value'
        );
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  });
  adapter.fetchSubjects('k_12').then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});

test('Fetch Taxonomy Subjects for Higher Education', function(assert) {
  const adapter = this.subject();
  this.pretender.map(function() {
    this.get(
      '/api/nucleus/v1/taxonomy/subjects',
      function(request) {
        assert.equal(
          request.queryParams.classification_type,
          'higher_education',
          'Wrong classification type value'
        );
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  });
  adapter.fetchSubjects('higher_education').then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});

test('Fetch Taxonomy Subjects for Professional Learning', function(assert) {
  const adapter = this.subject();
  this.pretender.map(function() {
    this.get(
      '/api/nucleus/v1/taxonomy/subjects',
      function(request) {
        assert.equal(
          request.queryParams.classification_type,
          'professional_learning',
          'Wrong classification type value'
        );
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  });
  adapter.fetchSubjects('professional_learning').then(function(response) {
    assert.deepEqual({}, response, 'Wrong response');
  });
});

test('Fetch Taxonomy Courses', function(assert) {
  const adapter = this.subject();
  this.pretender.map(function() {
    this.get(
      '/api/nucleus/v1/taxonomy/frameworks/framework-id/subjects/taxonomy-subject-id/courses',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  });
  adapter
    .fetchCourses('framework-id', 'taxonomy-subject-id')
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('Fetch Taxonomy Domains', function(assert) {
  const adapter = this.subject();
  this.pretender.map(function() {
    this.get(
      '/api/nucleus/v1/taxonomy/frameworks/framework-id/subjects/taxonomy-subject-id/courses/taxonomy-course-id/domains',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  });
  adapter
    .fetchDomains('framework-id', 'taxonomy-subject-id', 'taxonomy-course-id')
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});

test('Fetch Taxonomy Codes', function(assert) {
  const adapter = this.subject();
  this.pretender.map(function() {
    this.get(
      '/api/nucleus/v1/taxonomy/frameworks/framework-id/subjects/taxonomy-subject-id/courses/taxonomy-course-id/domains/taxonomy-domain-id/codes',
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify({})
        ];
      },
      false
    );
  });
  adapter
    .fetchCodes(
      'framework-id',
      'taxonomy-subject-id',
      'taxonomy-course-id',
      'taxonomy-domain-id'
    )
    .then(function(response) {
      assert.deepEqual({}, response, 'Wrong response');
    });
});
