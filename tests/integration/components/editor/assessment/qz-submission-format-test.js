import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent(
  'editor/assessment/qz-submission-format',
  'Integration | Component | editor/assessment/qz submission format',
  {
    integration: true,
    beforeEach: function() {
      this.i18n = this.container.lookup('service:i18n');
      this.i18n.set('locale', 'en');
    }
  }
);

test('Layout', function(assert) {
  this.render(hbs`{{editor/assessment/qz-submission-format}}`);
  var $submissionFormat = this.$();
  assert.ok(
    $submissionFormat.find('.panel.submission-format-textbox').length,
    'Missing text box option'
  );
  assert.ok(
    $submissionFormat.find('.panel.submission-format-upload').length,
    'Missing upload option'
  );
  assert.equal(
    $submissionFormat
      .find('.panel.submission-format-textbox .panel-footer')
      .text()
      .trim(),
    this.get('i18n').t('qz-submission-format.textbox').string,
    'Incorrect textbox label'
  );
  assert.equal(
    $submissionFormat
      .find('.panel.submission-format-upload .panel-footer')
      .text()
      .trim(),
    this.get('i18n').t('qz-submission-format.upload').string,
    'Incorrect upload label'
  );
});

test('Select Option', function(assert) {
  this.render(hbs`{{editor/assessment/qz-submission-format}}`);
  var $submissionFormat = this.$();
  var $upload = $submissionFormat.find('.panel.submission-format-upload');
  $upload.click();
  return wait().then(function() {
    assert.notOk(
      $submissionFormat.find('.panel.submission-format-textbox.active').length,
      'Textbox should not be active'
    );
    assert.ok(
      $submissionFormat.find('.panel.submission-format-upload.active').length,
      'Upload should be active'
    );
    var $textbox = $submissionFormat.find('.panel.submission-format-textbox');
    $textbox.click();
    return wait().then(function() {
      assert.ok(
        $submissionFormat.find('.panel.submission-format-textbox.active')
          .length,
        'Textbox should be active'
      );
      assert.notOk(
        $submissionFormat.find('.panel.submission-format-upload.active').length,
        'Upload should notbe active'
      );
    });
  });
});
