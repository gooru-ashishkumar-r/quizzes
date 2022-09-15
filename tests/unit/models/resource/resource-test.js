import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import { QUIZZES_RESOURCE_TYPES } from 'quizzes-addon/config/quizzes-config';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';

moduleFor('model:resource/resource', 'Unit | Model | resource/resource', {
  unit: true
});

test('isQuestion', function(assert) {
  assert.expect(1);
  const model = this.subject({
    isResource: false
  });

  assert.ok(model.get('isQuestion'), 'It should be question');
});

test('format question', function(assert) {
  assert.expect(1);
  const model = this.subject({
    isResource: false
  });

  assert.ok(model.get('format'), 'question');
});

test('format resource', function(assert) {
  assert.expect(1);
  const model = this.subject({
    isResource: false
  });

  assert.ok(model.get('format'), 'question');
});

test('isSingleChoice', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.singleChoice
  });

  assert.ok(model.get('isSingleChoice'), 'It should be single choice');
});

test('isMultipleAnswer', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.multipleAnswer
  });

  assert.ok(model.get('isMultipleAnswer'), 'It should be multiple answer');
});

test('isTrueFalse', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.trueFalse
  });

  assert.ok(model.get('isTrueFalse'), 'It should be true/false');
});

test('isOpenEnded', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.openEnded
  });

  assert.ok(model.get('isOpenEnded'), 'It should be open ended');
});

test('isFIB', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.fib
  });

  assert.ok(model.get('isFIB'), 'It should be fill in the blank');
});

test('isHotSpotText', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.hotSpotText
  });

  assert.ok(model.get('isHotSpotText'), 'It should be hot spot text');
});

test('isHotSpotImage', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.hotSpotImage
  });

  assert.ok(model.get('isHotSpotImage'), 'It should be hot spot image');
});

test('isHotTextReorder', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.hotTextReorder
  });

  assert.ok(model.get('isHotTextReorder'), 'It should be hot text reorder');
});

test('isHotTextHighlight', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.hotTextHighlightSentence
  });

  assert.ok(
    model.get('isHotTextHighlight'),
    'It should be hot text high light'
  );
});

test('isImageResource', function(assert) {
  assert.expect(1);
  const model = this.subject({
    resourceType: QUIZZES_RESOURCE_TYPES.image
  });

  assert.ok(model.get('isImageResource'), 'It should be image resource type');
});

test('isYoutubeResource', function(assert) {
  assert.expect(1);
  const model = this.subject({
    resourceType: QUIZZES_RESOURCE_TYPES.youtube
  });

  assert.ok(
    model.get('isYoutubeResource'),
    'It should be youtube resource type'
  );
});

test('isPDFResource', function(assert) {
  assert.expect(1);
  const model = this.subject({
    resourceType: QUIZZES_RESOURCE_TYPES.pdf
  });

  assert.ok(model.get('isPDFResource'), 'It should be pdf resource type');
});
test('isVimeoResource', function(assert) {
  assert.expect(1);
  const model = this.subject({
    resourceType: QUIZZES_RESOURCE_TYPES.vimeo
  });

  assert.ok(model.get('isVimeoResource'), 'It should be vimeo resource type');
});

test('isHotTextHighlightWord', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.hotTextHighlightWord
  });

  assert.ok(model.get('isHotTextHighlightWord'), 'It should be hot text word');
});

test('isHotTextHighlightSentence', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUESTION_TYPES.hotTextHighlightSentence
  });

  assert.ok(
    model.get('isHotTextHighlightSentence'),
    'It should be hot text sentence'
  );
});

test('hasAnswers', function(assert) {
  assert.expect(1);

  var answers = Ember.A();
  Ember.run(function() {
    answers.pushObject(Ember.Object.create({ id: 1 }));
  });

  const model = this.subject({ answers });
  assert.ok(model.get('hasAnswers'), 'It should have answers');
});

test('assetUrl', function(assert) {
  const model = this.subject({
    assetUrl: '/basePath/url'
  });

  assert.equal(
    model.get('assetUrl'),
    '/basePath/url',
    'Wrong value for assetUrl'
  );
});

test('isUrlResource', function(assert) {
  assert.expect(1);
  const model = this.subject({
    type: QUIZZES_RESOURCE_TYPES.url
  });

  assert.ok(model.get('isUrlResource'), 'It should be url resource type');
});

test('Resource image url', function(assert) {
  assert.expect(2);
  let model = this.subject({
    mediaUrl: '//dev.cdn.url/question-img.png'
  });

  assert.ok(model.get('hasMedia'), 'Wrong value for hasMedia field');
  assert.equal(
    model.get('mediaUrl'),
    '//dev.cdn.url/question-img.png',
    'Wrong value set for media url'
  );
});
