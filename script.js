document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const typingLines = [...document.querySelectorAll('.typing-line')];
  if (typingLines.length) {
    typingLines.forEach((line) => {
      const text = line.textContent;
      line.dataset.text = text;
      line.textContent = reducedMotion ? text : '';
    });
    if (!reducedMotion) {
      let delay = 250;
      typingLines.forEach((line) => {
        const text = line.dataset.text;
        [...text].forEach((character, index) => {
          window.setTimeout(() => { line.textContent += character; }, delay + index * 58);
        });
        delay += text.length * 58 + 180;
      });
    }
  }

  if (!reducedMotion && window.Lenis && window.gsap && window.ScrollTrigger) {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach((section) => {
      gsap.fromTo(section,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%',
            once: true,
          },
        }
      );
    });

    gsap.from('.project-card', {
      y: 0,
      scale: 0.97,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.project-grid',
        start: 'top 82%',
        once: true,
      },
    });

    gsap.to('.project-visual img', {
      y: -8,
      rotationZ: 1.5,
      duration: 2.4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
    });
  }

  const fpsIntro = document.querySelector('#fpsIntro');
  const fpsProgress = document.querySelector('#fpsProgress');

  if (fpsIntro) {
    const introStartedAt = performance.now();
    const closeIntro = () => {
      fpsIntro.classList.add('is-hidden');
      window.setTimeout(() => fpsIntro.remove(), 700);
    };

    const progressTimer = window.setInterval(() => {
      const progress = Math.min(100, Math.round(((performance.now() - introStartedAt) / 2400) * 100));
      if (fpsProgress) fpsProgress.textContent = `${String(progress).padStart(2, '0')}%`;
      if (progress >= 100) window.clearInterval(progressTimer);
    }, 40);

    window.setTimeout(closeIntro, 2500);
  }

  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const heroVisual = document.querySelector('.profile-shell');
  if (heroVisual) {
    heroVisual.style.transition = 'transform 0.2s ease';

    window.addEventListener('pointermove', (event) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 12;
      const y = (event.clientY / innerHeight - 0.5) * 12;

      heroVisual.style.transform = `rotateX(${(-y).toFixed(2)}deg) rotateY(${x.toFixed(2)}deg) translateY(-4px)`;
    });
  }

  const existingDots = document.querySelector('.pulse-dots');
  if (!existingDots) {
    const pulseDots = document.createElement('div');
    pulseDots.className = 'pulse-dots';

    for (let i = 0; i < 16; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'pulse-dot';

      const size = 8 + Math.random() * 18;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 6 + Math.random() * 8;

      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${left}%`;
      dot.style.top = `${top}%`;
      dot.style.animationDelay = `${delay}s`;
      dot.style.animationDuration = `${duration}s`;

      pulseDots.appendChild(dot);
    }

    document.body.appendChild(pulseDots);
  }

  const slides = [...document.querySelectorAll('.slide')];
  const slideDots = [...document.querySelectorAll('.slide-dot')];
  const prevButton = document.querySelector('.slide-btn.prev');
  const nextButton = document.querySelector('.slide-btn.next');

  if (slides.length) {
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;

      slides.forEach((slide, idx) => {
        slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

        const offset = (idx - currentSlide + slides.length) % slides.length;

        if (offset === 0) {
          slide.classList.add('active');
        } else if (offset === 1) {
          slide.classList.add('next');
        } else if (offset === slides.length - 1) {
          slide.classList.add('prev');
        } else if (offset === 2) {
          slide.classList.add('far-next');
        } else if (offset === slides.length - 2) {
          slide.classList.add('far-prev');
        }
      });

      slideDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    };

    const startAutoSlide = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 2600);
    };

    const mediaSlideshow = document.querySelector('.media-slideshow');
    if (mediaSlideshow) {
      mediaSlideshow.addEventListener('pointermove', (event) => {
        const rect = mediaSlideshow.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        mediaSlideshow.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
      });

      mediaSlideshow.addEventListener('pointerleave', () => {
        mediaSlideshow.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    }

    prevButton?.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoSlide();
    });

    nextButton?.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoSlide();
    });

    slideDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        showSlide(Number(dot.dataset.index));
        startAutoSlide();
      });
    });

    showSlide(0);
    startAutoSlide();
  }
});

