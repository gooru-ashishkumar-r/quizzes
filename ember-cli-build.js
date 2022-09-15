/*jshint node:true*/
/* global require, module */
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

var mathquillFonts = pickFiles('vendor/mathquill/font', {
  srcDir: '/',
  files: ['**/**'],
  destDir: '/assets/font'
});

var katexFonts = pickFiles('bower_components/KaTeX/dist/fonts', {
  srcDir: '/',
  files: ['**/**'],
  destDir: '/assets/fonts'
});

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    'ember-cli-qunit': {
      useLintTree: false
    },
    fingerprint: {
      exclude: ['themes/edify'] //excluding test theme files
    },
    babel: {
      includePolyfill: true
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  app.import({
    development: 'bower_components/toastr/toastr.js',
    production: 'bower_components/toastr/toastr.min.js'
  });

  app.import({
    development: 'bower_components/toastr/toastr.css',
    production: 'bower_components/toastr/toastr.min.css'
  });

  app.import({
    development: 'bower_components/sockjs-client/dist/sockjs.js',
    production: 'bower_components/sockjs-client/dist/sockjs.min.js'
  });

  app.import({
    development: 'bower_components/stomp-websocket/lib/stomp.js',
    production: 'bower_components/stomp-websocket/lib/stomp.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/core.js',
    production: 'bower_components/jquery-ui/ui/minified/core.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/widget.js',
    production: 'bower_components/jquery-ui/ui/minified/widget.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/mouse.js',
    production: 'bower_components/jquery-ui/ui/minified/mouse.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/sortable.js',
    production: 'bower_components/jquery-ui/ui/minified/sortable.min.js'
  });

  app.import({
    development:
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
    production:
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js'
  });

  // Add touch events to jquery UI: https://github.com/furf/jquery-ui-touch-punch
  app.import({
    development:
      'bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.js',
    production:
      'bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'
  });

  app.import({
    development: 'bower_components/bootstrap-toggle/css/bootstrap2-toggle.css',
    production:
      'bower_components/bootstrap-toggle/css/bootstrap2-toggle.min.css'
  });

  app.import({
    development: 'bower_components/bootstrap-toggle/js/bootstrap2-toggle.js',
    production: 'bower_components/bootstrap-toggle/js/bootstrap2-toggle.min.js'
  });

  app.import({
    development: 'bower_components/moment/moment.js',
    production: 'bower_components/moment/min/moment.min.js'
  });

  app.import({
    development:
      'bower_components/moment-timezone/builds/moment-timezone-with-data.js',
    production:
      'bower_components/moment-timezone/builds/moment-timezone-with-data.min.js'
  });

  app.import({
    development:
      'bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
    production:
      'bower_components/bootstrap-select/dist/css/bootstrap-select.min.css'
  });

  app.import({
    development:
      'bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
    production:
      'bower_components/bootstrap-select/dist/js/bootstrap-select.min.js'
  });

  app.import({
    development: 'bower_components/clipboard/dist/clipboard.js',
    production: 'bower_components/clipboard/dist/clipboard.min.js'
  });

  app.import({
    development: 'bower_components/intro.js/intro.js',
    production: 'bower_components/intro.js/minified/intro.min.js'
  });

  app.import({
    development: 'bower_components/intro.js/introjs.css',
    production: 'bower_components/intro.js/minified/introjs.min.css'
  });

  app.import({
    development: 'bower_components/jt.timepicker/jquery.timepicker.js',
    production: 'bower_components/jt.timepicker/jquery.timepicker.min.js'
  });

  app.import({
    development: 'bower_components/jt.timepicker/jquery.timepicker.css',
    production: 'bower_components/jt.timepicker/jquery.timepicker.css'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/effect.js',
    production: 'bower_components/jquery-ui/ui/minified/effect.min.js'
  });

  app.import({
    development: 'bower_components/jquery-ui/ui/effect-highlight.js',
    production: 'bower_components/jquery-ui/ui/minified/effect-highlight.min.js'
  });

  if (EmberAddon.env() === 'test') {
    app.import('vendor/wysihtml-dummy.js');
  } else {
    app.import({
      development: 'bower_components/wysihtml/dist/wysihtml-toolbar.js',
      production: 'bower_components/wysihtml/dist/wysihtml-toolbar.min.js'
    });
    app.import(
      'bower_components/wysihtml/parser_rules/advanced_and_extended.js'
    );
  }
  app.import('bower_components/KaTeX/dist/katex.min.css');
  app.import('bower_components/KaTeX/dist/katex.min.js');
  app.import('bower_components/KaTeX/dist/contrib/auto-render.min.js');

  app.import({
    development: 'vendor/mathquill/mathquill.js',
    production: 'vendor/mathquill/mathquill.min.js'
  });
  app.import('vendor/mathquill/mathquill.css');

  return mergeTrees([app.toTree(), mathquillFonts, katexFonts]);
};
