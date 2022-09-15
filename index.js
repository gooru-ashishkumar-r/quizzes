'use strict';

var pickFiles = require('broccoli-static-compiler');

module.exports = {
  name: 'quizzes-addon',
  treeForPublic: function(tree) {
    this._requireBuildPackages();

    if (!tree) {
      return tree;
    }

    return pickFiles(tree, {
      srcDir: 'assets/',
      destDir: `assets/${this.moduleName()}`
    });
  }
};
