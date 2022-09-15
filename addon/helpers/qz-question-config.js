import Ember from 'ember';
import { getQuestionConfig } from 'quizzes-addon/config/quizzes-question';

/**
 * Get the question config
 */
export function questionConfig(value /*, options*/) {
  const questionType = value[0];
  const propertyPath = value.length > 1 ? value[1] : undefined;
  return getQuestionConfig(questionType, propertyPath);
}

export default Ember.Helper.helper(questionConfig);
