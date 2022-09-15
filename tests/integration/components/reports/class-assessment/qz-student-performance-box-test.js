import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import QuestionResult from 'quizzes-addon/models/result/question';
import T from 'dummy/tests/helpers/assert';
import Ember from 'ember';

moduleForComponent(
  'reports/class-assessment/qz-student-performance-box',
  'Integration | Component | reports/class assessment/qz student performance box',
  {
    integration: true
  }
);

test('Layout when all completed', function(assert) {
  assert.expect(7);

  const student = Ember.Object.create({
    profileId: '56983a9060a68052c1ed934c',
    profileName: 'Rocha, Perez',
    lastFirstName: 'Perez, Rocha',
    isAttemptStarted: true,
    averageScore: 50,
    totalAnswered: 4
  });

  const reportData = Ember.A([
    QuestionResult.create({
      score: 100,
      resourceId: '569906aa20b7dfae1bcd5262',
      reaction: 2,
      savedTime: 701,
      skipped: false,
      answer: [{ value: 'answer' }]
    }),
    QuestionResult.create({
      score: 100,
      resourceId: '569906aa3ec3bb39969acbe6',
      reaction: 4,
      savedTime: 1333,
      skipped: false,
      answer: [{ value: 'answer' }]
    }),
    QuestionResult.create({
      score: 0,
      resourceId: '569906aadfa0072204f7c7c7',
      reaction: 5,
      skipped: true,
      answer: [{ value: 'answer' }]
    }),
    QuestionResult.create({
      score: 0,
      resourceId: '569906aacea8416665209d53',
      reaction: 1,
      savedTime: 1013,
      skipped: false,
      answer: [{ value: 'answer' }]
    })
  ]);

  this.set('student', student);
  this.set('reportData', reportData);

  this.on('selectStudent', function() {
    assert.ok(true, 'This should be called once');
  });

  this.render(hbs`{{reports/class-assessment/qz-student-performance-box
    student=student
    reportData=reportData
    onSelectStudent=(action 'selectStudent')}}`);

  const $component = this.$();
  T.exists(assert, $component.find('.panel'), 'Missing student box panel');

  const $header = $component.find('.panel .panel-heading');
  //T.exists(assert, $header, 'Missing student box title');
  //T.exists(assert, $header.find('.score'), 'Missing student box score');
  T.exists(assert, $header.find('.name'), 'Missing name');
  //assert.equal(T.text($header.find('.score')), '50%', 'Wrong score');

  const $questions = $component.find('.panel .questions');
  T.exists(assert, $questions, 'Missing questions area');

  assert.equal(
    $questions.find('span.correct').length,
    2,
    'It should displayed 2 correct questions'
  );
  assert.equal(
    $questions.find('span.incorrect').length,
    1,
    'It should displayed 1 incorrect question'
  );
  assert.equal(
    $questions.find('span.not-started').length,
    0,
    'It should displayed 0 not started questions'
  );
  assert.equal(
    $questions.find('span.skipped').length,
    1,
    'It should displayed 1 skipped question'
  );

  $component.find('.panel').click();
});

test('Layout having not started questions', function(assert) {
  assert.expect(7);

  const student = Ember.Object.create({
    profileId: '56983a9060a68052c1ed934c',
    profileName: 'Rocha, Perez',
    isAttemptStarted: true,
    averageScore: 50,
    totalAnswered: 4
  });

  const reportData = Ember.A([
    QuestionResult.create({
      score: 100,
      resourceId: '569906aa20b7dfae1bcd5262',
      reaction: 2,
      skipped: false,
      savedTime: 701,
      answer: [{ value: 'answer' }]
    }),
    QuestionResult.create({
      score: 100,
      resourceId: '569906aa3ec3bb39969acbe6',
      reaction: 4,
      skipped: false,
      savedTime: 1333,
      answer: [{ value: 'answer' }]
    }),
    QuestionResult.create({
      score: 0,
      resourceId: '569906aadfa0072204f7c7c7'
    }),
    QuestionResult.create({
      score: 0,
      resourceId: '569906aacea8416665209d53',
      reaction: 1,
      skipped: false,
      savedTime: 1013,
      answer: [{ value: 'answer' }]
    })
  ]);

  this.set('student', student);
  this.set('reportData', reportData);

  this.on('selectStudent', function() {
    assert.ok(true, 'This should be called once');
  });

  this.render(hbs`{{reports/class-assessment/qz-student-performance-box
    student=student
    reportData=reportData
    onSelectStudent=(action 'selectStudent')}}`);

  const $component = this.$();
  T.exists(assert, $component.find('.panel'), 'Missing student box panel');

  const $header = $component.find('.panel .panel-heading');
  T.exists(assert, $header, 'Missing student box title');
  //T.exists(assert, $header.find('.score'), 'Missing student box score');

  const $questions = $component.find('.panel .questions');
  T.exists(assert, $questions, 'Missing questions area');

  assert.equal(
    $questions.find('span.correct').length,
    2,
    'It should displayed 2 correct questions'
  );
  assert.equal(
    $questions.find('span.incorrect').length,
    1,
    'It should displayed 1 incorrect questions'
  );
  assert.equal(
    $questions.find('span.not-started').length,
    1,
    'It should displayed 1 not started question'
  );
  assert.equal(
    $questions.find('span.skipped').length,
    0,
    'It should displayed 0 skipped questions, they are treated as incorrect'
  );

  $component.find('.panel').click();
});

test('Showing student code in anonymous mode', function(assert) {
  assert.expect(3);

  const student = Ember.Object.create({
    profileId: '56983a9060a68052c1ed934c',
    profileName: 'Rocha, Perez',
    profileCode: 'abcde',
    isAttemptStarted: true,
    averageScore: 50
  });

  const reportData = Ember.A([
    QuestionResult.create({
      score: 100,
      resourceId: '569906aa20b7dfae1bcd5262',
      reaction: 2,
      savedTime: 701,
      answer: [{ value: 'answer' }]
    })
  ]);

  this.set('student', student);
  this.set('reportData', reportData);

  this.render(hbs`{{reports/class-assessment/qz-student-performance-box
    student=student
    reportData=reportData
    anonymous=true
  }}`);

  const $component = this.$();
  T.exists(assert, $component.find('.panel'), 'Missing student box panel');

  const $header = $component.find('.panel .panel-heading');
  T.exists(assert, $header, 'Missing student box title');
  assert.equal(
    T.text($header),
    'abcde',
    'Wrong title, it should use students code'
  );
});
