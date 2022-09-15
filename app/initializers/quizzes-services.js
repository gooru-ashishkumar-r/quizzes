import ConfigurationService from 'quizzes-addon/services/quizzes/configuration';
import ContextService from 'quizzes-addon/services/quizzes/api-sdk/context';
import AttemptService from 'quizzes-addon/services/quizzes/api-sdk/attempt';
import CollectionService from 'quizzes-addon/services/quizzes/api-sdk/collection';
import LookupService from 'quizzes-addon/services/quizzes/api-sdk/lookup';
import ProfileService from 'quizzes-addon/services/quizzes/api-sdk/profile';
import ResourceService from 'quizzes-addon/services/quizzes/api-sdk/resource';
import NotificationsService from 'quizzes-addon/services/quizzes/notifications';
import ClassService from 'quizzes-addon/services/quizzes/api-sdk/class';
import FeedbackService from 'quizzes-addon/services/quizzes/api-sdk/feedback';

export default {
  name: 'quizzes-services',
  initialize: function(application) {
    application.register('service:quizzes/configuration', ConfigurationService);
    application.register('service:quizzes/attempt', AttemptService);
    application.register('service:quizzes/context', ContextService);
    application.register('service:quizzes/collection', CollectionService);
    application.register('service:quizzes/lookup', LookupService);
    application.register('service:quizzes/profile', ProfileService);
    application.register('service:quizzes/resource', ResourceService);
    application.register('service:quizzes/notifications', NotificationsService);
    application.register('service:quizzes/class', ClassService);
    application.register('service:quizzes/feedback', FeedbackService);
  }
};
