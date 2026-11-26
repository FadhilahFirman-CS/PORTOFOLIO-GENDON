// @ts-check
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** @param {string} selector @returns {HTMLElement|null} */
  const $ = (selector) => document.querySelector(selector);
  /** @param {string} selector @returns {HTMLElement[]} */
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  document.querySelector('.nav')?.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', link.getAttribute('href'));
  });

  const audio = /** @type {HTMLAudioElement|null} */ ($('#portfolioMusic'));
  const musicToggle = $('#musicToggle');
  const musicLabel = musicToggle?.querySelector('.music-label');
  /** @param {boolean} playing */
  const updateMusic = (playing) => {
    if (!musicToggle) return;
    musicToggle.classList.toggle('is-playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.setAttribute('aria-label', playing ? 'Jeda musik' : 'Putar musik');
    if (musicLabel) musicLabel.textContent = playing ? 'Pause Music' : 'Play Music';
  };
  if (audio && musicToggle) {
    musicToggle.addEventListener('click', async () => {
      if (audio.paused) { try { await audio.play(); updateMusic(true); } catch { updateMusic(false); } }
      else { audio.pause(); updateMusic(false); }
    });
    audio.addEventListener('play', () => updateMusic(true));
    audio.addEventListener('pause', () => updateMusic(false));
  }
  const startMusic = () => { if (audio?.paused) audio.play().catch(() => updateMusic(false)); };
  ['click', 'keydown', 'touchstart'].forEach((eventName) => window.addEventListener(eventName, startMusic, { once: true, passive: true }));

  let typingDelay = 250;
  $$('.typing-line').forEach((line) => {
    const text = line.textContent ?? '';
    line.dataset.text = text;
    line.textContent = reducedMotion ? text : '';
    if (!reducedMotion) {
      [...text].forEach((character, index) => window.setTimeout(() => { line.textContent += character; }, typingDelay + index * 42));
      typingDelay += text.length * 42 + 140;
    }
  });

  const reveals = $$('.reveal');
  if (!reducedMotion && window.gsap && window.ScrollTrigger && reveals.length) {
    reveals.forEach((item) => item.classList.add('gsap-ready'));
    window.gsap.registerPlugin(ScrollTrigger);
    window.gsap.utils.toArray('.reveal').forEach((section) => {
      window.gsap.fromTo(section, { autoAlpha: 0, y: 32 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 88%', once: true }
      });
    });
    window.gsap.from('.hero-copy > *', { autoAlpha: 0, y: 22, duration: 0.7, stagger: 0.1, delay: 0.15, ease: 'power3.out' });
    window.gsap.from('.hero-visual', { autoAlpha: 0, x: 36, scale: 0.96, duration: 1, delay: 0.35, ease: 'power3.out' });
    window.gsap.from('.mini-stat', { autoAlpha: 0, y: 18, duration: 0.55, stagger: 0.12, delay: 0.75, ease: 'power2.out' });
  } else if ('IntersectionObserver' in window && reveals.length) {
    reveals.forEach((item) => item.classList.add('gsap-ready'));
    const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); currentObserver.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((item) => observer.observe(item));
  } else reveals.forEach((item) => item.classList.add('visible'));

  const intro = $('#fpsIntro'); const progressText = $('#fpsProgress');
  if (intro) {
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const progress = Math.min(100, Math.round(((performance.now() - startedAt) / 12000) * 100));
      if (progressText) progressText.textContent = `${String(progress).padStart(2, '0')}%`;
      if (progress >= 100) clearInterval(timer);
    }, 80);
    window.setTimeout(() => { intro.classList.add('is-hidden'); startMusic(); window.setTimeout(() => intro.remove(), 700); }, reducedMotion ? 500 : 12000);
  } else startMusic();

});
