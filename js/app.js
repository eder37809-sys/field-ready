/* ==========================================================================
   FIELD READY - INTERACTIVE CONTROLLER
   Matura-Projekt von Thomas Eder
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPortalNavigation();
  initPrototypeSimulator();
  initOnboardingFlow();
  initTrainingInteractions();
  initPositionSwitching();
  initChatSimulation();
  initDesignSystemTools();
  initPricingToggle();
});

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color:var(--color-neon);">⚡</span> ${message}`;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// 1. Portal Navigation (Top Tabs)
function initPortalNavigation() {
  const tabs = document.querySelectorAll('.portal-tab-btn');
  const sections = document.querySelectorAll('.portal-section');

  window.switchPortalTab = function(targetId) {
    tabs.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === targetId);
    });
    sections.forEach(sec => {
      sec.classList.toggle('active', sec.id === targetId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      switchPortalTab(targetId);
    });
  });
}

// 2. Prototype Mobile Simulator
let currentScreenId = 'screen-home';

function initPrototypeSimulator() {
  const screenBtns = document.querySelectorAll('.screen-select-btn');
  const mobileScreens = document.querySelectorAll('.mobile-screen-view');
  const tabItems = document.querySelectorAll('.ios-tab-bar .tab-item');

  window.switchMobileScreen = function(screenId) {
    currentScreenId = screenId;

    // Update side buttons
    screenBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-screen') === screenId);
    });

    // Update visible screen
    mobileScreens.forEach(sc => {
      sc.classList.toggle('active', sc.id === screenId);
    });

    // Sync bottom tab bar
    tabItems.forEach(tab => {
      const tabTarget = tab.getAttribute('data-screen-target');
      tab.classList.toggle('active', tabTarget === screenId);
    });

    // Scroll mobile viewport to top
    const scrollContainer = document.querySelector('.screen-scroll-container');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  };

  screenBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-screen');
      switchMobileScreen(target);
    });
  });

  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-screen-target');
      if (target) {
        switchMobileScreen(target);
      }
    });
  });
}

// 3. Onboarding Flow Inside Mobile Prototype
let currentOnboardingStep = 1;

function initOnboardingFlow() {
  const slides = document.querySelectorAll('.onboard-slide');
  const nextBtns = document.querySelectorAll('.onboard-next-btn');
  const prevBtns = document.querySelectorAll('.onboard-prev-btn');
  const finishBtn = document.getElementById('finish-onboard-btn');
  const goalCards = document.querySelectorAll('.goal-select-chip');

  function updateSlide(step) {
    slides.forEach((sl, idx) => {
      sl.style.display = (idx + 1 === step) ? 'block' : 'none';
    });
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentOnboardingStep < 3) {
        currentOnboardingStep++;
        updateSlide(currentOnboardingStep);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentOnboardingStep > 1) {
        currentOnboardingStep--;
        updateSlide(currentOnboardingStep);
      }
    });
  });

  goalCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const isSelected = card.classList.contains('selected');
      card.style.borderColor = isSelected ? 'var(--color-neon)' : 'var(--border-subtle)';
      card.style.background = isSelected ? 'var(--color-neon-subtle)' : 'var(--bg-card)';
    });
  });

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      showToast('Profil erfolgreich erstellt! Willkommen bei Field Ready!');
      switchMobileScreen('screen-home');
    });
  }
}

// 4. Training Plan Interactions
function initTrainingInteractions() {
  const checkButtons = document.querySelectorAll('.exercise-card .check-btn');
  let completedCount = 1;
  const totalExercises = 4;

  checkButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.exercise-card');
      const isDone = card.classList.toggle('completed');

      if (isDone) {
        completedCount = Math.min(totalExercises, completedCount + 1);
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
        showToast('Übung abgeschlossen! Starker Einsatz.');
      } else {
        completedCount = Math.max(0, completedCount - 1);
        btn.innerHTML = '';
      }

      updateCircularProgressRing(completedCount, totalExercises);
    });
  });
}

function updateCircularProgressRing(completed, total) {
  const rings = document.querySelectorAll('.ring-bar');
  const labels = document.querySelectorAll('.ring-percent-text');
  const percent = Math.round((completed / total) * 100);
  const circumference = 251.2; // 2 * PI * 40
  const offset = circumference - (percent / 100) * circumference;

  rings.forEach(ring => {
    ring.style.strokeDashoffset = offset;
  });

  labels.forEach(lbl => {
    lbl.innerText = `${percent}%`;
  });
}

// 5. Position Training Switcher
function initPositionSwitching() {
  const positionPills = document.querySelectorAll('.position-tab-pill');
  const positionContents = document.querySelectorAll('.position-drill-view');

  positionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const pos = pill.getAttribute('data-position');

      positionPills.forEach(p => {
        p.classList.toggle('active', p === pill);
        if (p === pill) {
          p.style.background = 'var(--color-neon)';
          p.style.color = '#000000';
          p.style.borderColor = 'var(--color-neon)';
        } else {
          p.style.background = 'transparent';
          p.style.color = 'var(--text-secondary)';
          p.style.borderColor = 'var(--border-subtle)';
        }
      });

      positionContents.forEach(view => {
        view.style.display = (view.getAttribute('data-pos-view') === pos) ? 'block' : 'none';
      });
    });
  });
}

// 6. Coach Chat Simulation
function initChatSimulation() {
  const chatInput = document.getElementById('chat-input-field');
  const sendBtn = document.getElementById('chat-send-btn');
  const chatStream = document.getElementById('mobile-chat-stream');
  const uploadVideoBtn = document.getElementById('chat-upload-video-btn');

  if (!chatInput || !sendBtn || !chatStream) return;

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble bubble-user';
    userMsg.innerHTML = `${text}<div style="font-size:0.65rem; text-align:right; opacity:0.75; margin-top:2px;">Gerade eben</div>`;
    chatStream.appendChild(userMsg);
    chatInput.value = '';

    // Scroll down
    chatStream.scrollTop = chatStream.scrollHeight;

    // Simulate Coach Thomas response
    setTimeout(() => {
      const coachMsg = document.createElement('div');
      coachMsg.className = 'chat-bubble bubble-coach';
      coachMsg.innerHTML = `
        <div style="font-size:0.7rem; font-weight:700; color:var(--color-neon); margin-bottom:2px;">Coach Thomas</div>
        Stark Lukas! Genau die richtige Einstellung. Achte heute bei den Sprints besonders auf den ersten Bodenkontakt – maximale Hebelkraft nach vorn! 🔥
        <div style="font-size:0.65rem; color:var(--text-muted); margin-top:4px;">Gerade eben</div>
      `;
      chatStream.appendChild(coachMsg);
      chatStream.scrollTop = chatStream.scrollHeight;
      showToast('Neue Nachricht von Coach Thomas erhalten!');
    }, 900);
  }

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  if (uploadVideoBtn) {
    uploadVideoBtn.addEventListener('click', () => {
      showToast('Technikvideo ausgewählt! Wird hochgeladen...');
      setTimeout(() => {
        const videoMsg = document.createElement('div');
        videoMsg.className = 'chat-bubble bubble-user';
        videoMsg.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.2rem;">📹</span>
            <div>
              <div style="font-weight:700;">sprint_start_10m.mp4</div>
              <div style="font-size:0.68rem; opacity:0.8;">14.2 MB • Zur Analyse eingereicht</div>
            </div>
          </div>
        `;
        chatStream.appendChild(videoMsg);
        chatStream.scrollTop = chatStream.scrollHeight;
        showToast('Video hochgeladen! Status: "Wartet auf Analyse durch Thomas"');
      }, 700);
    });
  }
}

// 7. Design System Copy Hex Codes
function initDesignSystemTools() {
  const colorCards = document.querySelectorAll('.color-card');
  colorCards.forEach(card => {
    card.addEventListener('click', () => {
      const hex = card.getAttribute('data-hex');
      if (hex) {
        navigator.clipboard.writeText(hex).then(() => {
          showToast(`Farbwert ${hex} in die Zwischenablage kopiert!`);
        }).catch(() => {
          showToast(`Farbe: ${hex}`);
        });
      }
    });
  });
}

// 8. Pricing Toggle (Monatlich / Jährlich)
function initPricingToggle() {
  const monthlyBtn = document.getElementById('pricing-monthly-btn');
  const yearlyBtn = document.getElementById('pricing-yearly-btn');
  const priceBasic = document.getElementById('price-basic-val');
  const pricePrem = document.getElementById('price-premium-val');
  const priceElite = document.getElementById('price-elite-val');

  if (!monthlyBtn || !yearlyBtn) return;

  monthlyBtn.addEventListener('click', () => {
    monthlyBtn.classList.add('active');
    yearlyBtn.classList.remove('active');
    monthlyBtn.style.background = 'var(--color-neon)';
    monthlyBtn.style.color = '#000000';
    yearlyBtn.style.background = 'transparent';
    yearlyBtn.style.color = 'var(--text-secondary)';

    if (priceBasic) priceBasic.innerText = '9,99€';
    if (pricePrem) pricePrem.innerText = '24,99€';
    if (priceElite) priceElite.innerText = '79,99€';
  });

  yearlyBtn.addEventListener('click', () => {
    yearlyBtn.classList.add('active');
    monthlyBtn.classList.remove('active');
    yearlyBtn.style.background = 'var(--color-neon)';
    yearlyBtn.style.color = '#000000';
    monthlyBtn.style.background = 'transparent';
    monthlyBtn.style.color = 'var(--text-secondary)';

    if (priceBasic) priceBasic.innerText = '7,99€';
    if (pricePrem) pricePrem.innerText = '19,99€';
    if (priceElite) priceElite.innerText = '64,99€';
    showToast('20% Rabatt bei jährlicher Abrechnung aktiviert!');
  });
}
