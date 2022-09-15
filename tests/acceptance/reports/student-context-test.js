import { skip } from 'qunit';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import T from 'dummy/tests/helpers/assert';

moduleForAcceptance('Acceptance | reports/student-context');

skip('Layout', function(assert) {
  assert.expect(6);
  visit('/reports/student-context/context-simple-id');

  andThen(function() {
    assert.equal(currentURL(), '/reports/student-context/context-simple-id');
    const $studentReport = find('.reports.qz-student-report');
    T.notExists(assert, $studentReport, 'Missing report');
    assert.notOk(
      $studentReport.find('.summary-container .percentage').text(),
      '67%',
      'Wrong grade'
    );
    assert.notOk(
      $studentReport.find('.bubbles-list').children().length,
      2,
      'Wrong length of questions'
    );
    const $questions = $studentReport.find('.qz-questions.performance-view');
    T.notExists(
      assert,
      $questions.find('table tr:first-child .question-score .incorrect'),
      'Wrong score value for first answer'
    );
    T.notExists(
      assert,
      $questions.find('table tr:last-child .question-score .correct'),
      'Wrong score value for last answer'
    );
  });
});
