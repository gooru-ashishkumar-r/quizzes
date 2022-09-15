import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['qz-match-the-following'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   *
   * @property {Array} userAnswer has Array of user answered objects
   */
  userAnswers: Ember.computed('question', function() {
    let answers = this.get('question.answer') || [];
    return answers.map(item => item.value);
  }),

  showCorrect: false,

  /**
   * Convenient structure to render the question answer choices
   * @property {*}
   */
  answers: Ember.computed('question', function() {
    let answers = this.get('question.resource.answerDetails');
    return answers;
  }),

  leftArray: Ember.computed('answers', function() {
    let left = Ember.A();
    this.get('answers').forEach(answer => {
      let answerObject = Ember.Object.create({
        sequence: answer.sequence,
        leftValue: answer.left_value,
        leftValueFormat: answer.left_value_format
      });
      left.pushObject(answerObject);
    });
    return left;
  }),

  rightArray: Ember.computed('answers', function() {
    let right = Ember.A();
    const userAnsObj = Ember.A();
    const showCorrect = this.get('showCorrect');
    const userAnswers = this.get('userAnswers');
    this.get('answers').forEach(answer => {
      let answerObject = Ember.Object.create({
        sequence: answer.sequence,
        rightValue: answer.right_value,
        leftValue: answer.left_value,
        rightValueFormat: answer.right_value_format,
        rightValShuffleOrder: answer.right_val_shuffle_order
      });
      right.pushObject(answerObject);
    });

    userAnswers.forEach(userSeq => {
      const ansObj = right.find(item => {
        return (
          `${item.sequence},${item.leftValue},${item.rightValue},${item.rightValShuffleOrder}` ===
          userSeq
        );
      });
      userAnsObj.pushObject(ansObj);
    });
    return showCorrect ? right : userAnsObj;
  })
});
