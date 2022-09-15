/* eslint require-jsdoc: 0 */
import { moduleFor } from 'ember-qunit';
import Pretender from 'pretender';

export default function(name, moduleName, options = {}) {
  moduleFor(name, moduleName, {
    needs: options.needs,
    beforeEach() {
      //Starting the pretender
      this.pretender = new Pretender();

      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      //Stopping the pretender
      this.pretender.shutdown();

      if (options.afterEach) {
        options.afterEach.apply(this, arguments);
      }
    }
  });
}
