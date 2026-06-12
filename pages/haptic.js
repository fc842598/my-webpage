/* haptic.js — Vibration API wrapper for mobile */
(function() {
  'use strict';

  window.Haptic = {
    supported: () => !!navigator.vibrate,
    
    // 轻微脉冲（充能一次）
    pulse: (ms = 10) => {
      if (navigator.vibrate) navigator.vibrate(ms);
    },
    
    // 强度变化（1.0 = 最强）
    intensity: (strength = 0.5) => {
      const ms = Math.round(5 + strength * 45);
      if (navigator.vibrate) navigator.vibrate(ms);
    },
    
    // 模式：短促三连（结果确定）
    settle: () => {
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
    },
    
    // 模式：长脉冲（充能满）
    full: () => {
      if (navigator.vibrate) navigator.vibrate(80);
    },
    
    stop: () => {
      if (navigator.vibrate) navigator.vibrate(0);
    }
  };
})();
