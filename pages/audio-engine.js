/* audio-engine.js - compact coin and shell sounds */
(function() {
  'use strict';

  window.DivinationAudio = function() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();

    function resume() {
      if (ctx.state === 'suspended') ctx.resume();
    }

    function makeGain(volume, start, duration) {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      gain.connect(ctx.destination);
      return gain;
    }

    function ping(freq, delay = 0, duration = 0.16, volume = 0.18) {
      resume();
      const start = ctx.currentTime + delay;
      const out = makeGain(volume, start, duration);
      [1, 1.32, 1.86].forEach((ratio, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq * ratio, start);
        gain.gain.setValueAtTime(1 / (i + 1.4), start);
        osc.connect(gain);
        gain.connect(out);
        osc.start(start);
        osc.stop(start + duration);
      });
    }

    function clickNoise(delay = 0, duration = 0.045, volume = 0.07, filterFreq = 2600) {
      resume();
      const start = ctx.currentTime + delay;
      const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        const fade = 1 - i / length;
        data[i] = (Math.random() * 2 - 1) * fade;
      }
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = makeGain(volume, start, duration);
      source.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(filterFreq, start);
      filter.Q.setValueAtTime(1.25, start);
      source.connect(filter);
      filter.connect(gain);
      source.start(start);
      source.stop(start + duration);
    }

    function shake() {
      [0, 0.075, 0.15].forEach((delay, i) => {
        clickNoise(delay, 0.05, 0.038, 1700 + i * 180);
        ping(210 + i * 28, delay, 0.10, 0.035);
      });
    }

    function pour() {
      [0, 0.075, 0.15].forEach((delay, i) => {
        clickNoise(delay, 0.055, 0.052, 2200 - i * 180);
        ping(390 - i * 52, delay, 0.13, 0.075);
      });
    }

    function spin() {
      [0, 0.18, 0.36].forEach((delay, i) => {
        ping(190 + i * 14, delay, 0.12, 0.032);
      });
    }

    function settle() {
      ping(275, 0, 0.22, 0.11);
      ping(205, 0.06, 0.18, 0.075);
      clickNoise(0.01, 0.07, 0.055, 1700);
    }

    return { resume, shake, pour, spin, settle };
  };
})();
