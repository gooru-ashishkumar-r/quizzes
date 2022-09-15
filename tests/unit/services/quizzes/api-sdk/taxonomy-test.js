import Ember from 'ember';
import { test } from 'ember-qunit';
import moduleForService from 'dummy/tests/helpers/module-for-service';

moduleForService(
  'service:quizzes/api-sdk/taxonomy',
  'Unit | Service | quizzes/api-sdk/taxonomy',
  {
    // needs: ['serializer:foo']
  }
);

test('fetchSubjects', function(assert) {
  const service = this.subject();

  assert.expect(2);

  service.set(
    'taxonomyAdapter',
    Ember.Object.create({
      fetchSubjects: function(type) {
        assert.deepEqual(type, 'k_12', 'Wrong profile data');
        return Ember.RSVP.resolve([]);
      }
    })
  );

  service.set(
    'taxonomySerializer',
    Ember.Object.create({
      normalizeFetchSubjects: function(subjectsPayload) {
        assert.deepEqual(subjectsPayload, [], 'Wrong subjects payload');
        return [];
      }
    })
  );

  var done = assert.async();
  service.fetchSubjects('k_12').then(function() {
    done();
  });
});

test('fetchCourses', function(assert) {
  const service = this.subject();

  assert.expect(3);

  service.set(
    'taxonomyAdapter',
    Ember.Object.create({
      fetchCourses: function(frameworkId, taxonomySubjectId) {
        assert.deepEqual(
          frameworkId,
          'framework-id',
          'Wrong frameworkId value'
        );
        assert.deepEqual(
          taxonomySubjectId,
          'taxonomy-subject-id',
          'Wrong taxonomySubjectId value'
        );
        return Ember.RSVP.resolve([]);
      }
    })
  );

  service.set(
    'taxonomySerializer',
    Ember.Object.create({
      normalizeFetchCourses: function(coursesPayload) {
        assert.deepEqual(coursesPayload, [], 'Wrong courses payload');
        return [];
      }
    })
  );

  var done = assert.async();
  service.fetchCourses('framework-id', 'taxonomy-subject-id').then(function() {
    done();
  });
});

test('fetchDomains', function(assert) {
  const service = this.subject();

  assert.expect(4);

  service.set(
    'taxonomyAdapter',
    Ember.Object.create({
      fetchDomains: function(frameworkId, taxonomySubjectId, taxonomyCourseId) {
        assert.deepEqual(
          frameworkId,
          'framework-id',
          'Wrong frameworkId value'
        );
        assert.deepEqual(
          taxonomySubjectId,
          'taxonomy-subject-id',
          'Wrong taxonomySubjectId value'
        );
        assert.deepEqual(
          taxonomyCourseId,
          'taxonomy-course-id',
          'Wrong taxonomyCourseId value'
        );
        return Ember.RSVP.resolve([]);
      }
    })
  );

  service.set(
    'taxonomySerializer',
    Ember.Object.create({
      normalizeFetchDomains: function(domainsPayload) {
        assert.deepEqual(domainsPayload, [], 'Wrong domains payload');
        return [];
      }
    })
  );

  var done = assert.async();
  service
    .fetchDomains('framework-id', 'taxonomy-subject-id', 'taxonomy-course-id')
    .then(function() {
      done();
    });
});

test('fetchCodes', function(assert) {
  const service = this.subject();

  assert.expect(5);

  service.set(
    'taxonomyAdapter',
    Ember.Object.create({
      fetchCodes: function(
        frameworkId,
        taxonomySubjectId,
        taxonomyCourseId,
        taxonomyDomainId
      ) {
        assert.deepEqual(
          frameworkId,
          'framework-id',
          'Wrong frameworkId value'
        );
        assert.deepEqual(
          taxonomySubjectId,
          'taxonomy-subject-id',
          'Wrong taxonomySubjectId value'
        );
        assert.deepEqual(
          taxonomyCourseId,
          'taxonomy-course-id',
          'Wrong taxonomyCourseId value'
        );
        assert.deepEqual(
          taxonomyDomainId,
          'taxonomy-domain-id',
          'Wrong taxonomyDomainId value'
        );
        return Ember.RSVP.resolve([]);
      }
    })
  );

  service.set(
    'taxonomySerializer',
    Ember.Object.create({
      normalizeFetchCodes: function(codesPayload) {
        assert.deepEqual(codesPayload, [], 'Wrong codes payload');
        return [];
      }
    })
  );

  var done = assert.async();
  service
    .fetchCodes(
      'framework-id',
      'taxonomy-subject-id',
      'taxonomy-course-id',
      'taxonomy-domain-id'
    )
    .then(function() {
      done();
    });
});
