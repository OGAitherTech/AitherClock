/* Aither Clock v13 sound effects — generated with Web Audio, no external audio files. */
(() => {
  const KEY = 'aither-sound';
  let ctx = null;
  let lastTick = 0;

  const enabled = () => localStorage.getItem(KEY) !== 'off';

  function audio() {
    if (!enabled()) return null;
    try {
      ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch {
      return null;
    }
  }

  function tone(frequency, duration = 0.055, volume = 0.045, type = 'sine', delay = 0) {
    const ac = audio();
    if (!ac) return;
    const now = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  window.AitherSounds = {
    click: () => tone(520, 0.045, 0.035, 'sine'),
    select: () => tone(700, 0.06, 0.04, 'sine'),
    success: () => { tone(660, 0.07, 0.04, 'sine'); tone(880, 0.1, 0.04, 'sine', 0.06); },
    error: () => { tone(230, 0.09, 0.035, 'square'); tone(180, 0.12, 0.03, 'square', 0.08); },
    tick: () => {
      const now = Date.now();
      if (now - lastTick < 800) return;
      lastTick = now;
      tone(1150, 0.025, 0.018, 'sine');
    },
    countdown: () => tone(820, 0.08, 0.05, 'sine'),
    alarm: () => {
      tone(740, 0.14, 0.06, 'sine');
      tone(880, 0.14, 0.06, 'sine', 0.16);
      tone(740, 0.14, 0.06, 'sine', 0.32);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const interactive = 'button, select, input[type="checkbox"], input[type="radio"]';
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener('click', () => {
        if (el.disabled) return;
        if (el.id === 'testSound') return;
        window.AitherSounds.click();
      }, { passive: true });
      el.addEventListener('change', () => window.AitherSounds.select(), { passive: true });
    });

    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => window.AitherSounds.select(), { passive: true });
    });

    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) soundToggle.addEventListener('click', () => setTimeout(() => {
      if (localStorage.getItem(KEY) !== 'off') window.AitherSounds.success();
    }, 30), { passive: true });
  });
})();
