/**
 * Shared UI Utilities for Party Games Platform
 * - Toast notifications
 * - Standardized room invite link copying with clipboard fallback & feedback
 * - Confetti celebrations
 * - Modal helpers
 */

(function(global) {
  'use strict';

  // 1. Toast Notification Helper
  function showToast(msg, duration = 2500) {
    if (!msg) return;
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('show');

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // 2. Room Invite Link Copying
  function copyRoomLink(roomCode, gameName, clickEvent) {
    let code = roomCode;
    if (!code && typeof currentRoom !== 'undefined') code = currentRoom;
    if (!code && global.gameState && global.gameState.room) code = global.gameState.room;
    if (!code) {
      const params = new URLSearchParams(window.location.search);
      code = params.get('room') || '';
    }

    const url = window.location.origin + window.location.pathname + (code ? `?room=${encodeURIComponent(code)}` : '');

    // Check for button trigger to provide inline feedback
    const evt = clickEvent || (typeof window !== 'undefined' ? window.event : null);
    let btn = null;
    if (evt) {
      if (evt.currentTarget && evt.currentTarget.tagName === 'BUTTON') {
        btn = evt.currentTarget;
      } else if (evt.target) {
        btn = evt.target.closest('button');
      }
    }

    const origHtml = btn ? btn.innerHTML : null;

    function applySuccess() {
      if (btn && origHtml && !btn.dataset.copied) {
        btn.dataset.copied = 'true';
        btn.innerHTML = '<span>✓ Link Copied!</span>';
        setTimeout(() => {
          btn.innerHTML = origHtml;
          delete btn.dataset.copied;
        }, 2200);
      }
      showToast('Invite link copied to clipboard! 🔗');
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(applySuccess).catch(() => {
        execFallback(url, applySuccess);
      });
    } else {
      execFallback(url, applySuccess);
    }
  }

  function execFallback(url, onSuccess) {
    try {
      const input = document.createElement('input');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      input.value = url;
      document.body.appendChild(input);
      input.select();
      const success = document.execCommand('copy');
      document.body.removeChild(input);
      if (success) {
        onSuccess();
        return;
      }
    } catch (e) {}
    prompt('Copy this room invite link:', url);
  }

  // 3. Confetti Celebration Effect
  function launchConfetti(durationMs = 3000) {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#00f2fe', '#0a84ff', '#ffd60a', '#ff3b30', '#30d158', '#bf5af2', '#ff9f0a', '#f59e0b'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 50,
        w: 8 + Math.random() * 8,
        h: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: 2.5 + Math.random() * 5,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8
      });
    }

    const start = Date.now();
    let animId = null;

    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (Date.now() - start < durationMs) {
        animId = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (animId) cancelAnimationFrame(animId);
      }
    }
    renderConfetti();
  }

  // 4. Modal Helpers
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  }

  // Bind to global window
  global.showToast = showToast;
  global.copyRoomLink = copyRoomLink;
  global.copyInviteLink = copyRoomLink;
  global.launchConfetti = launchConfetti;
  global.triggerConfetti = launchConfetti;
  global.openModal = openModal;
  global.closeModal = closeModal;

})(typeof window !== 'undefined' ? window : this);
