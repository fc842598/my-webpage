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
      [1, 1.48, 2.32].forEach((ratio, i) => {
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
      filter.Q.setValueAtTime(1.8, start);
      source.connect(filter);
      filter.connect(gain);
      source.start(start);
      source.stop(start + duration);
    }

    function shake() {
      [0, 0.055, 0.11, 0.17].forEach((delay, i) => {
        clickNoise(delay, 0.045, 0.055, 2400 + i * 260);
        ping(280 + i * 35, delay, 0.09, 0.055);
      });
    }

    function pour() {
      [0, 0.075, 0.15].forEach((delay, i) => {
        clickNoise(delay, 0.05, 0.075, 3000 - i * 260);
        ping(510 - i * 70, delay, 0.11, 0.12);
      });
    }

    function spin() {
      [0, 0.12, 0.24, 0.38].forEach((delay, i) => {
        ping(230 + i * 18, delay, 0.12, 0.055);
      });
    }

    function settle() {
      ping(360, 0, 0.20, 0.18);
      ping(255, 0.055, 0.18, 0.12);
      clickNoise(0.01, 0.065, 0.095, 2200);
    }

    return { resume, shake, pour, spin, settle };
  };
})();
