/* audio-engine.js - compact coin and shell sounds */
(function() {
  'use strict';

  let sharedContext = null;

  function getAudioContext() {
    if (sharedContext) return sharedContext;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    try {
      sharedContext = new AudioCtx();
      return sharedContext;
    } catch {
      return null;
    }
  }

  function resumeContext(ctx) {
    if (!ctx || ctx.state === 'running') return Promise.resolve(Boolean(ctx));
    try {
      const pending = ctx.resume();
      pending?.catch?.(() => {});
      return pending;
    } catch {
      return Promise.resolve(false);
    }
  }

  function primeContext(ctx) {
    if (!ctx) return;
    try {
      const source = ctx.createBufferSource();
      source.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      source.connect(ctx.destination);
      source.start(0);
    } catch {}
  }

  window.DivinationAudio = function() {
    const ctx = getAudioContext();
    if (!ctx) {
      return {
        resume: () => Promise.resolve(false),
        shake: () => {},
        pour: () => {},
        spin: () => {},
        settle: () => {},
      };
    }

    function resume() {
      return resumeContext(ctx);
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
      thump(82, 0, 0.72, 0.11);
      [0.04, 0.34, 0.68].forEach((delay, i) => {
        clickNoise(delay, 0.12, 0.04, 980 + i * 90);
        ping(128 + i * 14, delay + 0.04, 0.24, 0.032);
      });
    }

    function pour() {
      thump(104, 0, 0.78, 0.09);
      [0.08, 0.44, 0.78].forEach((delay, i) => {
        clickNoise(delay, 0.13, 0.052, 1500 - i * 150);
        ping(246 - i * 34, delay + 0.04, 0.28, 0.062);
      });
    }

    function spin() {
      [0, 0.52, 1.04].forEach((delay, i) => {
        ping(136 + i * 8, delay, 0.32, 0.032);
      });
    }

    function settle() {
      thump(104, 0, 0.72, 0.12);
      ping(188, 0.12, 0.34, 0.08);
      ping(142, 0.36, 0.28, 0.052);
      clickNoise(0.08, 0.14, 0.056, 1050);
    }

    return { resume, shake, pour, spin, settle };
  };

  // Must be called from a real user gesture (submit/tap), before motion events.
  window.DivinationAudio.unlock = function() {
    const ctx = getAudioContext();
    if (!ctx) return Promise.resolve(false);
    const pending = resumeContext(ctx);
    primeContext(ctx);
    return pending;
  };
})();
