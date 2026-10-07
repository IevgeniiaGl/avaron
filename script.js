const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });

  window.addEventListener('pageshow', () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  });
}

const slider = document.querySelector('.hero-slider');

if (slider) {
  const slides = [...slider.querySelectorAll('.hero-slide')];
  const dots = [...slider.querySelectorAll('.slider-dot')];
  let current = 0;
  let timer;
  let touchStartX = 0;
  let touchStartY = 0;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', String(active));
    });
  };

  const autoplay = () => {
    clearInterval(timer);
    if (slides.length > 1) {
      timer = setInterval(() => show(current + 1), 4000);
    }
  };

  show(0);

  const move = (step) => {
    show(current + step);
    autoplay();
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      show(index);
      autoplay();
    });
  });

  slider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      move(1);
    }
  });

  slider.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    clearInterval(timer);
  }, { passive: true });

  slider.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const distanceX = touch.clientX - touchStartX;
    const distanceY = touch.clientY - touchStartY;

    if (Math.abs(distanceX) >= 45 && Math.abs(distanceX) > Math.abs(distanceY)) {
      move(distanceX < 0 ? 1 : -1);
    } else {
      autoplay();
    }
  }, { passive: true });

  slider.addEventListener('touchcancel', autoplay, { passive: true });

  slider.addEventListener('focusin', () => clearInterval(timer));
  slider.addEventListener('focusout', autoplay);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      autoplay();
    }
  });

  autoplay();
}
