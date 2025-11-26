// Bold Craft Afrika - Interactions & Animations

// Smooth scroll for internal nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}


// Scrollspy for nav links
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links .nav-link');

const spy = () => {
  const scrollPos = window.scrollY || window.pageYOffset;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    const offsetTop = scrollPos + rect.top;
    const offsetBottom = offsetTop + rect.height;
    const id = sec.getAttribute('id');
    if (scrollPos + 120 >= offsetTop && scrollPos + 120 < offsetBottom) {
      navItems.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', spy, { passive: true });
spy();

// Reveal-on-scroll animations
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18
  }
);

revealElements.forEach(el => observer.observe(el));

// Stat counters in hero
const counters = document.querySelectorAll('.meta-number');

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || '0');
      let start = 0;
      const duration = 900;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * (target - start) + start);
        el.textContent = value + (target > 10 ? '+' : '');
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

counters.forEach(c => counterObserver.observe(c));


// Hero typing animation
const typingSpan = document.getElementById('hero-typing');
if (typingSpan) {
  const phrases = JSON.parse(typingSpan.dataset.phrases || '[]');
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    if (!phrases.length) return;
    const current = phrases[phraseIndex % phrases.length];
    if (!deleting) {
      charIndex++;
      if (charIndex >= current.length + 6) {
        deleting = true;
      }
    } else {
      charIndex--;
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex++;
      }
    }
    typingSpan.textContent = current.slice(0, Math.max(charIndex, 0));
    const delay = deleting ? 70 : 120;
    setTimeout(type, delay);
  };

  type();
}

// Testimonials slider
const track = document.querySelector('.testimonials-track');
const slides = track ? Array.from(track.children) : [];
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let currentSlide = 0;

function updateSlider() {
  if (!track || !slides.length) return;
  const offset = currentSlide * track.clientWidth;
  track.style.transform = `translateX(-${offset}px)`;
}

function goToSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  updateSlider();
}

if (prevBtn && nextBtn && slides.length) {
  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  window.addEventListener('resize', updateSlider);
  // Auto-rotate
  setInterval(() => goToSlide(currentSlide + 1), 9000);
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-question');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});



// Parallax effect for hero background and foreground
const heroBg = document.querySelector('.hero-bg');
const heroCopy = document.querySelector('.hero-copy');
const heroShowcase = document.querySelector('.hero-showcase');

if (heroBg || heroCopy || heroShowcase) {
  const parallax = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (heroBg) {
      const offsetBg = scrollY * -0.2;
      heroBg.style.transform = `translateY(${offsetBg}px)`;
    }
    if (heroCopy) {
      const offsetCopy = scrollY * 0.04;
      heroCopy.style.transform = `translateY(${offsetCopy}px)`;
    }
    if (heroShowcase) {
      const offsetShow = scrollY * 0.06;
      heroShowcase.style.transform = `translateY(${offsetShow}px)`;
    }
  };
  window.addEventListener('scroll', parallax, { passive: true });
  parallax();
}


// Page fade-in
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});


// Portfolio filters
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

if (filterButtons.length && portfolioCards.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      portfolioCards.forEach(card => {
        const cat = card.dataset.category || 'all';
        if (filter === 'all' || filter === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Portfolio modal
const modal = document.querySelector('.portfolio-modal');
const modalBackdrop = modal ? modal.querySelector('.portfolio-modal-backdrop') : null;
const modalBody = modal ? modal.querySelector('.modal-body') : null;
const modalTitle = modal ? modal.querySelector('.modal-title') : null;
const modalTagline = modal ? modal.querySelector('.modal-tagline') : null;
const modalImg = modal ? modal.querySelector('.modal-image') : null;
const modalDesc = modal ? modal.querySelector('.modal-description') : null;
const modalClose = modal ? modal.querySelector('.modal-close') : null;

if (modal && portfolioCards.length) {
  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3')?.textContent || '';
      const subtitle = card.querySelector('p')?.textContent || '';
      const img = card.querySelector('img')?.getAttribute('src') || '';
      const desc = card.querySelector('p:last-of-type')?.textContent || subtitle;

      if (modalTitle) modalTitle.textContent = title;
      if (modalTagline) modalTagline.textContent = subtitle;
      if (modalImg && img) modalImg.src = img;
      if (modalDesc) modalDesc.textContent = desc;

      modal.classList.add('open');
    });
  });

  const closeModal = () => modal.classList.remove('open');

  modalClose && modalClose.addEventListener('click', closeModal);
  modalBackdrop && modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

// Auto year in footer
const yearSpan = document.querySelector('[data-year]');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Intro preloader
const preloaderEl = document.getElementById('preloader');
window.addEventListener('load', () => {
  if (!preloaderEl) return;
  preloaderEl.classList.add('preloader-hide');
  setTimeout(() => {
    preloaderEl.remove();
  }, 800);
});
