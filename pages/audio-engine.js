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

    function thump(freq = 110, delay = 0, duration = 0.38, volume = 0.075) {
      resume();
      const start = ctx.currentTime + delay;
      const out = makeGain(volume, start, duration);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.55), start + duration);
      osc.connect(out);
      osc.start(start);
      osc.stop(start + duration);
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
      thump(96, 0, 0.42, 0.075);
      [0.02, 0.20, 0.42].forEach((delay, i) => {
        clickNoise(delay, 0.075, 0.028, 1200 + i * 110);
        ping(150 + i * 18, delay + 0.025, 0.16, 0.024);
      });
    }

    function pour() {
      thump(124, 0, 0.46, 0.06);
      [0.04, 0.26, 0.50].forEach((delay, i) => {
        clickNoise(delay, 0.07, 0.042, 1850 - i * 170);
        ping(305 - i * 42, delay + 0.02, 0.18, 0.052);
      });
    }

    function spin() {
      [0, 0.34, 0.70].forEach((delay, i) => {
        ping(160 + i * 10, delay, 0.20, 0.024);
      });
    }

    function settle() {
      thump(132, 0, 0.56, 0.095);
      ping(220, 0.08, 0.26, 0.075);
      ping(168, 0.22, 0.24, 0.046);
      clickNoise(0.04, 0.09, 0.05, 1350);
    }

    return { resume, shake, pour, spin, settle };
  };
})();
