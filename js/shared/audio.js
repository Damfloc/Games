/**
 * Shared Web Audio Synthesizer for Party Games Platform
 * Synthesizes game sound effects dynamically with 0 external asset dependencies.
 */

(function(global) {
  'use strict';

  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) {
        audioCtx = new AudioClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Auto-init on first user gesture
  if (typeof window !== 'undefined') {
    const unlockAudio = () => {
      initAudio();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    if (isMuted) return;
    try {
      if (!audioCtx) initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playCardDraw() {
    playTone(480, 0.07, 'sine', 0.12);
  }

  function playGunshot() {
    playTone(180, 0.08, 'sawtooth', 0.35);
    setTimeout(() => playTone(60, 0.25, 'triangle', 0.3), 50);
  }

  function playSaloonChime() {
    playTone(392, 0.15, 'sine', 0.15);
    setTimeout(() => playTone(587.33, 0.25, 'sine', 0.2), 120);
  }

  function playChime() {
    playTone(523.25, 0.12, 'sine', 0.18);
    setTimeout(() => playTone(659.25, 0.18, 'sine', 0.18), 100);
  }

  function playDynamite() {
    playTone(90, 0.4, 'sawtooth', 0.45);
    setTimeout(() => playTone(45, 0.8, 'triangle', 0.4), 100);
  }

  function playBuzzer() {
    playTone(130, 0.28, 'sawtooth', 0.3);
    setTimeout(() => playTone(110, 0.35, 'sawtooth', 0.3), 100);
  }

  function playTimerTick() {
    playTone(880, 0.03, 'sine', 0.08);
  }

  function playSuccess() {
    playTone(440, 0.1, 'sine', 0.18);
    setTimeout(() => playTone(554.37, 0.1, 'sine', 0.18), 80);
    setTimeout(() => playTone(659.25, 0.18, 'sine', 0.2), 160);
  }

  function playVictoryFanfare() {
    playTone(523.25, 0.18, 'triangle', 0.25); // C5
    setTimeout(() => playTone(659.25, 0.18, 'triangle', 0.25), 150); // E5
    setTimeout(() => playTone(783.99, 0.22, 'triangle', 0.25), 300); // G5
    setTimeout(() => playTone(1046.50, 0.55, 'triangle', 0.35), 480); // C6
  }

  function setMuted(val) {
    isMuted = !!val;
  }

  function toggleMuted() {
    isMuted = !isMuted;
    return isMuted;
  }

  // Export
  global.initAudio = initAudio;
  global.playTone = playTone;
  global.playCardDraw = playCardDraw;
  global.playGunshot = playGunshot;
  global.playSaloonChime = playSaloonChime;
  global.playChime = playChime;
  global.playDynamite = playDynamite;
  global.playBuzzer = playBuzzer;
  global.playTimerTick = playTimerTick;
  global.playSuccess = playSuccess;
  global.playVictoryFanfare = playVictoryFanfare;
  global.setAudioMuted = setMuted;
  global.toggleAudioMuted = toggleMuted;

})(typeof window !== 'undefined' ? window : this);
