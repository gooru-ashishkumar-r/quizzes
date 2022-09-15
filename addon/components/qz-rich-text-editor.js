import Ember from 'ember';
import { LATEX_EXPRESSIONS } from 'quizzes-addon/config/quizzes-question';
import { removeHtmlTags, generateUUID } from 'quizzes-addon/utils/utils';

/**
 * Rich text editor component
 *
 * @module
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['qz-rich-text-editor'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    toggleExpressionsPanel() {
      if (this.get('showExpressionsPanel')) {
        this.cancelExpression();
      }
      this.toggleProperty('showExpressionsPanel');
    },
    insertExpression() {
      var component = this;
      var editorClass = `.editor-box${component.get('editorIndex')}`;

      if (component.get('editor') && component.get('mathField')) {
        const latex = component.get('mathField').latex();
        const html = `<span class='gru-math-expression'><span class='source' hidden>${latex}</span>${katex.renderToString(
          latex
        )}</span>`;
        component.get('editor').focus();

        if (component.get('cursor')) {
          component
            .get('editor')
            .composer.selection.setBookmark(component.get('cursor'));
        }
        if (component.get('editor').composer) {
          component.get('editor').composer.commands.exec('insertHTML', html);
          //content set may cause back track
          var editorElement = component.$(editorClass);
          component.set('content', editorElement.html());
          component.makeExpressionsReadOnly();
          component.setCursor();
        }
      }
      this.cancelExpression();
      this.toggleProperty('showExpressionsPanel');
    },
    updateExpression() {
      var component = this;
      var editorClass = `.editor-box${component.get('editorIndex')}`;
      if (
        component.get('editingExpression') &&
        component.get('editor') &&
        component.get('mathField')
      ) {
        const latex = component.get('mathField').latex();
        const source = component.get('editingExpression').find('.source');
        if (source && source.length && latex !== source.text()) {
          const html = katex.renderToString(latex);
          source.text(latex);
          component
            .get('editingExpression')
            .find('.katex')
            .replaceWith(html);
          var editorElement = component.$(editorClass);
          component.set('content', editorElement.html());
          component.makeExpressionsReadOnly();
          component.setCursor();
          this.cancelExpression();
          this.toggleProperty('showExpressionsPanel');
        }
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    var component = this;
    var editorId = `wysihtml-editor${component.get('editorIndex')}`;
    var editorClass = `.editor-box${component.get('editorIndex')}`;
    var toolbarId = `wysihtml-toolbar${component.get('editorIndex')}`;
    var mathExp = `#wysihtml-editor${component.get(
      'editorIndex'
    )}.editable .gru-math-expression`;
    var mathFieldClass = `.math-field${component.get('editorIndex')}`;

    var mathFieldSpan = component.$(mathFieldClass)[0];
    // Initialize Mathquill
    var MQ = MathQuill.getInterface(2);
    component.set('mathField', MQ.MathField(mathFieldSpan));
    component.set('MQ', MQ);

    // Initialize RTE

    var editor = new wysihtml5.Editor(editorId, {
      toolbar: toolbarId,
      cleanUp: false,
      parserRules: true
    });

    component.set('editor', editor);

    /**
     * Function to run on load
     */
    function onLoad() {
      Ember.run(function() {
        if (editor.composer && editor.composer.commands) {
          if (!component.get('disableFocus')) {
            editor.focus();
          }

          if (component.get('content')) {
            if (!component.get('disableFocus')) {
              editor.composer.commands.exec(
                'insertHTML',
                component.get('content')
              );
              component.setCursor();
            } else {
              editor.setValue(component.get('content'));
            }
            component.renderMathExpressions();
            component.makeExpressionsReadOnly();
          }
        }
      });
      // unobserve load Event
      editor.stopObserving('onLoad', onLoad);
    }

    // observe load Event
    editor.on('load', onLoad);

    // Add expression to MathQuill field
    component.$().on('click', '.tab-pane a', function(e) {
      e.preventDefault();
      var expression = $(this).data('expression');
      if (component.get('mathField') && LATEX_EXPRESSIONS[expression]) {
        component
          .get('mathField')
          .write(LATEX_EXPRESSIONS[expression])
          .focus();
      }
    });
    // Save cursor position
    component.$().on('click', editorClass, function(e) {
      e.preventDefault();
      component.setCursor();
    });

    component.$().on('keyup', editorClass, function(e) {
      e.preventDefault();
      var editorElement = component.$(editorClass);
      component.set('content', editorElement.html());
      component.setCursor();
    });

    component.$().on('focusout', editorClass, function() {
      component.sendAction('onFocusOut');
    });

    // Go to edit mode of existing expression
    component.$().on('click', mathExp, function(e) {
      e.preventDefault();
      var sourceLatex = $(mathExp)
        .find('.source')
        .text();
      if (sourceLatex && sourceLatex !== '') {
        component.set('editingExpression', $(mathExp).closest(mathExp));
        component.set('showExpressionsPanel', true);
        Ember.run.later(function() {
          component
            .get('mathField')
            .latex(sourceLatex)
            .reflow()
            .focus();
        }, 100);
      }
    });
  },

  /**
   * willDestroyElement events
   */
  willDestroyElement: function() {
    const component = this;
    var editorClass = `.editor-box${component.get('editorIndex')}`;
    var mathExp = `#wysihtml-editor${component.get(
      'editorIndex'
    )}.editable .gru-math-expression`;

    component.$().off('click', '.tab-pane a');
    component.$().off('click', editorClass);
    component.$().off('keyup', editorClass);
    component.$().off('focusout', editorClass);
    component.$().off('click', mathExp);
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Boolean} Indicates if the expressions panel must be showed
   */
  showExpressionsPanel: false,

  /**
   * @property {DOMElement} Reference to the DOM element of the editing expression
   */
  editingExpression: null,

  /**
   * @property {boolean} Indicates it the user is editing an existing expression
   */
  isEditingExpression: Ember.computed('editingExpression', function() {
    return this.get('editingExpression') !== null;
  }),

  /**
   * @property {MQ} Mathquill instance
   */
  MQ: null,

  /**
   * @property {MathQuill} MathQuill field reference
   */
  mathField: null,

  /**
   * @property {Object} wysihtml5 editor instance
   */
  editor: null,

  /**
   * @property {string} content to edit
   */
  content: null,

  /**
   * @param {Object} model - Model that will be attached to the component
   */
  model: null,

  /**
   * @param {String} valuePath - value used to set the validation message
   */
  valuePath: '',

  /**
   * @property {WrappedRange} Cursor position on wysihtml5 editor
   */
  cursor: null,

  /**
   * @param {String} uuid
   */
  uuid: null,

  /**
   * @param {Computed } showMessage - computed property that defines if show validation messages
   */
  showMessage: Ember.computed('content', function() {
    var contentEditor = removeHtmlTags(this.get('content'));
    if ($.trim(contentEditor) === '') {
      //this.set('content', contentEditor);
      return true;
    }
    return false;
  }),

  /**
   * @param {Computed } editorIndex - computed property that generate an UUID for the editor index
   */

  editorIndex: Ember.computed(function() {
    let editorIndex = this.get('uuid');
    if (!editorIndex) {
      editorIndex = generateUUID();
    }

    return editorIndex;
  }),

  restoreMathAndSelection: Ember.observer('showExpressionsPanel', function() {
    var component = this;
    Ember.run.later(function() {
      if (component.get('showExpressionsPanel')) {
        if (component.get('mathField')) {
          component.get('mathField').focus();
        }
      } else {
        if (component.get('cursor')) {
          component.setCursor();
        }
      }
    }, 100);
  }),

  disableFocus: false,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Makes sure that the expressions inside the RTE are not editable
   */
  makeExpressionsReadOnly() {
    this.$('.gru-math-expression').attr('contenteditable', false);
  },
  /**
   * Cancel expression panel
   */
  cancelExpression() {
    this.get('mathField').latex(''); // Clear math field
    this.set('editingExpression', null);
  },

  setCursor() {
    var component = this;
    var composer = component.get('editor').composer;
    if (composer.selection) {
      component.set('cursor', composer.selection.getBookmark());
      composer.selection.setBookmark(component.get('cursor'));
    }
    component.get('editor').focus();
  },

  /**
   * It searches all of the text nodes in a given element for the given delimiters, and renders the math in place.
   */
  renderMathExpressions() {
    var editorId = `wysihtml-editor${this.get('editorIndex')}`;
    window.renderMathInElement(document.getElementById(editorId), {
      delimiters: [{ left: '$$', right: '$$', display: false }]
    });
  }
});
