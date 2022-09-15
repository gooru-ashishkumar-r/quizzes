import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('player', { path: '/player/:contextId' });
  this.route('resource-player', { path: '/resource-player/:resourceId' });

  this.route('edit', function() {
    this.route('assessment', { path: '/assessment/:assessmentId' });
  });

  this.route('reports', function() {
    this.route('context', { path: '/context/:contextId' });
    this.route('student-context', { path: '/student-context/:contextId' });
  });
  this.route('assign', { path: '/assessment/:assessmentId' });
  this.route('assignments', { path: '/profile/:profileId' });

  this.route('student-independent-learning', function() {
    this.route('assessments');
  });

  this.route('student', function() {
    this.route('class', { path: '/class/:classId' }, function() {
      this.route('course-map');
    });
    this.route('independent', { path: '/course/:courseId' }, function() {
      this.route('course-map');
    });
  });
});

export default Router;
