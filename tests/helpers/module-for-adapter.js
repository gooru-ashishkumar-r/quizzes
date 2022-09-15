/* eslint require-jsdoc: 0 */
import { moduleFor } from 'ember-qunit';
import Pretender from 'pretender';

export default function(name, moduleName, options = {}) {
  moduleFor(name, moduleName, {
    needs: options.needs,

    beforeEach: function(assert) {
      // Start up Pretender
      this.pretender = new Pretender();
      // Defines default unhandled request function
      this.pretender.unhandledRequest = function(verb, path) {
        assert.ok(false, `Wrong request [${verb}] url: ${path}`);
      };

      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }
    },

    afterEach: function() {
      // Shut down Pretender
      this.pretender.shutdown();

      if (options.afterEach) {
        options.afterEach.apply(this, arguments);
      }
    }
  });
}
