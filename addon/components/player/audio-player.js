import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['qz-audio-player'],
  /**
   * @property {Boolean} isPause
   */
  isPause: false,
  /*
   * Hold the audio details
   */
  audioRecorder: null,
  actions: {
    onPlayAudio(url, index) {
      const component = this;
      let _audio = component.get('audioRecorder');
      if (!_audio || component.get('answerIndex') !== index) {
        _audio = new Audio(url);
        component.set('answerIndex', index);
      }
      component.set('audioRecorder', _audio);
      _audio.play();
      component.set('isPause', true);
      _audio.ontimeupdate = function() {
        component
          .$('.audio-player .audio-progress .progress-filling')
          .css('width', `${(_audio.currentTime / _audio.duration) * 100}%`);
      };
      _audio.addEventListener('ended', () => {
        component.set('isPause', false);
      });
    },
    //Action triggered when pause audio
    onPauseAudio() {
      const component = this;
      const audio = component.get('audioRecorder');
      audio.pause();
      component.set('isPause', false);
    }
  }
});
