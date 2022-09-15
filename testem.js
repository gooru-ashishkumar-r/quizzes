module.exports = {
  framework: 'qunit',
  test_page: 'tests/index.html?hidepassed',
  reporter: 'tap',
  tap_quiet_logs: false,
  xunit_intermediate_output: false,
  disable_watching: true,
  parallel: 4,
  launch_in_ci: ['PhantomJS'],
  launch_in_dev: ['PhantomJS', 'Chrome'],

  proxies: {
    '/quizzes': {
      target: 'http://localhost:8882'
    },
    '/api': {
      target: 'http://localhost:8882'
    }
  }
};
