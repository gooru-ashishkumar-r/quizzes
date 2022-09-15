import Ember from 'ember';
import ResourceComponent from 'quizzes-addon/components/player/resources/qz-resource';

/**
 * Youtube resource component
 *
 * Component responsible for controlling the logic and appearance of the youtube resource type
 *
 * @module
 * @see controllers/player.js
 * @see components/player/qz-viewer.js
 * @augments Ember/Component
 **/

export default ResourceComponent.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes
  classNames: ['qz-youtube-resource'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties

  aspectRatio: {
    width: 16,
    height: 9
  },

  videoCounts: 0,

  /**
   * @property {string}Begin playing the video at the given number of seconds from the start of the video
   */
  start: Ember.computed('resource.displayGuide.start_time', function() {
    const component = this;
    const playerMetadata = component.get('resource.playerMetadata');
    if (playerMetadata && playerMetadata.length) {
      var videoCounts = component.get('videoCounts');
      const startTime = playerMetadata[videoCounts].start_time;
      var seconds = moment.duration(startTime).asSeconds();
      return seconds;
    } else {
      return null;
    }
  }),

  /**
   * @property {string}The time, measured in seconds from the start of the video, when the player should stop playing the video
   */
  stop: Ember.computed('resource.displayGuide.end_time', function() {
    const component = this;
    const playerMetadata = component.get('resource.playerMetadata');
    if (playerMetadata && playerMetadata.length) {
      var videoCounts = component.get('videoCounts');
      const stopTime = playerMetadata[videoCounts].end_time;
      var seconds = moment.duration(stopTime).asSeconds();
      return seconds;
    } else {
      return null;
    }
  }),

  /**
   * @property {string} full resource youtube url
   */
  youtubeUrl: Ember.computed('resource.body', function() {
    const Env = Ember.getOwner(this).resolveRegistration('config:environment');
    const url = this.get('resource.body');
    const youtubeId = this.getYoutubeIdFromUrl(url);
    const player = Env.player.youtubePlayerUrl;
    const start = this.get('start');
    const stop = this.get('stop');
    return `${player}${youtubeId}?start=${start}&end=${stop}&rel=0&version=3&enablejsapi=1`;
  }),

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Convert the time in this format 00:00:00 to seconds
   */
  convertToSeconds: function(time) {
    var sections = time.split(':');
    return (
      parseInt(sections[0] * 3600) +
      parseInt(sections[1] * 60) +
      parseInt(sections[2])
    );
  },

  /**
   * Retrieves the youtube id from a url
   * @param url
   * @returns {*}
   */
  getYoutubeIdFromUrl: function(url) {
    const regexp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regexp);
    if (match && match[2].length === 11) {
      return match[2];
    }
  },

  init() {
    let controller = this;
    controller._super(...arguments);
    controller.loadScript();
  },

  loadScript() {
    let controller = this;
    //eslint-disable-next-line
    if (typeof YT == 'undefined' || typeof YT.Player == 'undefined') {
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubePlayerAPIReady = function() {
        //eslint-disable-next-line
        new YT.Player('player', {
          events: {
            onStateChange: function(evt) {
              //eslint-disable-next-line
              if (evt.data === YT.PlayerState.ENDED) {
                controller.loadNextVideo();
              }
            }
          }
        });
      };
    } else {
      //eslint-disable-next-line
      new YT.Player('player', {
        events: {
          onStateChange: function(evt) {
            //eslint-disable-next-line
            if (evt.data === YT.PlayerState.ENDED) {
              controller.loadNextVideo();
            }
          }
        }
      });
    }
  },

  loadNextVideo() {
    let controller = this;
    var videoCount = controller.get('videoCounts');
    controller.set('videoCounts', videoCount + 1);
    var videoCounts = controller.get('videoCounts');
    const playerMetadata = controller.get('resource.playerMetadata');
    if (
      playerMetadata &&
      playerMetadata.length &&
      playerMetadata[videoCounts]
    ) {
      const Env = Ember.getOwner(this).resolveRegistration(
        'config:environment'
      );
      const url = controller.get('resource.body');
      const youtubeId = controller.getYoutubeIdFromUrl(url);
      const player = Env.player.youtubePlayerUrl;

      const startTime = playerMetadata[videoCounts].start_time;
      const endTime = playerMetadata[videoCounts].end_time;
      const start = moment.duration(startTime).asSeconds();
      const stop = moment.duration(endTime).asSeconds();
      const videoUrl = `${player}${youtubeId}?start=${start}&end=${stop}&rel=0&version=3&autoplay=1&enablejsapi=1`;
      controller.set('youtubeUrl', videoUrl);
      controller.loadScript();
    }
  }
});
