/*
 Production Environment configuration properties
 */
export default {
  endpoint: {
    url: 'https://qa.api.quizzes.edify.cr',
    secureUrl: 'https://qa.api.quizzes.edify.cr/',
    providerUrl: 'https://nile-qa.gooru.org'
  },

  realTime: {
    webServiceUrl: 'https://qa.api.quizzes.edify.cr',
    webServiceUri: '/',
    webSocketUrl: 'https://qa.api.quizzes.edify.cr',
    webSocketUri: '/ws/quizzes-realtime'
  },

  FILE_UPLOAD: {
    MAX_SIZE_IN_MB: 12
  }
};
