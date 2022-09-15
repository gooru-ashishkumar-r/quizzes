import Ember from 'ember';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import AnswerModel from 'quizzes-addon/models/resource/answer';
import { QUESTION_TYPES } from 'quizzes-addon/config/quizzes-question';
import RubricSerializer from 'quizzes-addon/serializers/rubric/rubric';

/**
 * Serializer for Resource
 *
 * @typedef {Object} ResourceSerializer
 */
export default Ember.Object.extend({
  /**
   * @property {rubricSerializer} taxonomySerializer
   */
  rubricSerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'rubricSerializer',
      RubricSerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },
  /**
   * @property {Ember.Service} Service to session
   */
  session: Ember.inject.service('session'),

  /**
   * Assign the content CDN url from authenticated session object
   * @type {String}
   */
  contentCDNUrl: Ember.computed.alias('session.cdnUrls.content'),

  /**
   * Normalize the resource data into a Resource object
   * @param resourceData
   * @returns {Resource}
   */
  normalizeReadResource: function(resourceData) {
    const serializer = this;
    const questionData =
      resourceData.title || !resourceData.metadata
        ? resourceData
        : resourceData.metadata;
    const interaction = questionData ? questionData.interaction : null;
    const playerMetadata = resourceData.playerMetadata
      ? resourceData.playerMetadata
      : null;
    const additionalAttributes =
      playerMetadata && playerMetadata.additional_attributes
        ? playerMetadata.additional_attributes
        : null;
    const questionMetadata = questionData.questionMetadata || null;
    const resource = ResourceModel.create(
      Ember.getOwner(this).ownerInjection(),
      {
        id: resourceData.id,
        isResource: resourceData.isResource,
        sequence: resourceData.sequence,
        answerDetails: questionData.answers,
        hint: questionData.hintExplanationDetail,
        body: questionData.url || questionData.body,
        description: questionData.description,
        correctAnswer: questionData.correctAnswer,
        narration: questionData.narration,
        ownerId: questionData.creator_id || questionData.ownerId,
        title: questionData.title,
        thumbnail: questionData.thumbnail,
        displayGuide:
          questionData.display_guide &&
          (questionData.display_guide.is_broken === 1 ||
            questionData.display_guide.is_frame_breaker === 1),
        type: questionData.content_subformat || questionData.type,
        mediaUrl: questionData.thumbnail
          ? serializer.get('contentCDNUrl') + questionData.thumbnail
          : null,
        baseAnswers: questionData.answers,
        playerMetadata: resourceData.playerMetadata
          ? resourceData.playerMetadata.video_timeline_by_competencies
          : [],
        metadata: questionMetadata,
        htmlContent: questionData.html_content
          ? decodeURIComponent(escape(atob(questionData.html_content)))
          : null,
        showScore: !(
          resourceData &&
          resourceData.display_guide &&
          resourceData.display_guide.show_scores === false
        )
      }
    );

    if (resourceData.SubResource && resourceData.SubResource.length) {
      resource.set(
        'subQuestions',
        Ember.A(
          resourceData.SubResource.map(item =>
            serializer.normalizeReadResource(item)
          )
        )
      );
    }

    resource.set(
      'displayGuide',
      resource.get('displayGuide') || this.checkURLProtocol(resource.body)
    );

    if (interaction) {
      resource.setProperties({
        answers: serializer.normalizeAnswers(interaction.choices),
        maxChoices: interaction.maxChoices,
        prompt: interaction.prompt,
        shuffle: interaction.isShuffle
      });
    }
    if (
      resource.get('type') === QUESTION_TYPES.openEnded &&
      resourceData.rubric
    ) {
      resource.set(
        'rubric',
        this.get('rubricSerializer').normalizeRubric(resourceData.rubric)
      );
    }
    if (
      resource.get('type') === QUESTION_TYPES.serpChooseOne &&
      additionalAttributes
    ) {
      resource.set(
        'questionText',
        additionalAttributes.chooseone_question_text || null
      );
    }
    if (
      resource.get('type') === QUESTION_TYPES.serpSorting &&
      additionalAttributes
    ) {
      resource.setProperties({
        softText: additionalAttributes.soft_text || '',
        hardText: additionalAttributes.hard_text || ''
      });
    }
    return resource;
  },

  /**
   * Normalize the choices data into answers array
   * @param choices array
   * @returns {Answer[]}
   */
  normalizeAnswers: function(choices) {
    return Ember.isArray(choices)
      ? choices.map(answer => this.normalizeAnswer(answer))
      : [];
  },

  /**
   * Normalize the choice data into an answer object
   * @param choice object
   * @returns {Answer}
   */
  normalizeAnswer: function(choice) {
    return AnswerModel.create(Ember.getOwner(this).ownerInjection(), {
      isFixed: choice.isFixed,
      text: choice.text,
      value: choice.value,
      struggles: choice.struggles
    });
  },

  /**
   * Check if the current location protocol matches
   * @param url
   * @returns {Boolean}
   */
  checkURLProtocol: function(url) {
    return window.location.protocol === 'https:' && /^((http):\/\/)/.test(url);
  }
});
