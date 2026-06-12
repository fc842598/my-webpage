/* audio-engine.js — Web Audio synthesis for divination sounds */
(function() {
  'use strict';

  window.DivinationAudio = function() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    function sine(freq, duration, volume = 0.3) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    }

    function noise(duration, volume = 0.2, filterFreq = 3000) {
      const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < buf.length; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      src.buffer = buf;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      filter.frequency.value = filterFreq;
      filter.type = 'lowpass';
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      src.start(ctx.currentTime);
    }

    function metallic(freq, duration, volume = 0.25) {
      // 金属音：基频 + 多个倍频叠加
      const harmonics = [freq, freq*1.5, freq*2.1, freq*3.2];
      harmonics.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = f;
        osc.type = 'sine';
        gain.gain.setValueAtTime(volume * (0.5 / (i+1)), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      });
    }

    function shake() {
      // 龟甲内铜钱碰撞：快速噪音 + 金属音
      noise(0.15, 0.15, 4000);
      metallic(220, 0.12, 0.15);
      setTimeout(() => {
        noise(0.12, 0.12, 3800);
        metallic(180, 0.1, 0.12);
      }, 80);
      setTimeout(() => {
        noise(0.1, 0.1, 3600);
        metallic(200, 0.08, 0.1);
      }, 150);
    }

    function pour() {
      // 铜钱倒出：快速下行的金属音 + 淡淡噪音
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const f = 420 - i * 80;
          metallic(f, 0.08, 0.2);
          noise(0.06, 0.08, 4500);
        }, i * 50);
      }
    }

    function spin() {
      // 旋转嗡嗡声：持续的低频嗡鸣（来回变调）
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.sinusoidalRampToValueAtTime(280, ctx.currentTime + 0.3);
      osc.frequency.sinusoidalRampToValueAtTime(240, ctx.currentTime + 0.6);
      osc.frequency.sinusoidalRampToValueAtTime(260, ctx.currentTime + 0.9);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 1.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
    }

    function settle() {
      // 落定瞬间：庄重的铜磬音（长尾衰减）
      metallic(320, 1.2, 0.35);
      sine(160, 0.8, 0.18);  // 低频撑腰
    }

    return {
      shake,   // 摇甲声
      pour,    // 倒出声
      spin,    // 旋转嗡嗡
      settle   // 落定铜磬
    };
  };
})();
