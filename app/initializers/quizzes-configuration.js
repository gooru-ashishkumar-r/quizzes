/**
 * Load configuration file
 */
export function initialize(application) {
  const configurationService = application.__container__.lookup(
    'service:quizzes/configuration'
  );
  // Wait until all of the following promises are resolved
  application.deferReadiness();
  configurationService.loadConfiguration().then(function() {
    // Continue the Application boot process, allowing other Initializers to run
    application.advanceReadiness();
  });
}

export default {
  name: 'quizzes-configuration',
  after: 'quizzes-services',
  initialize: initialize
};
