const btn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const initialCoords = section1.getBoundingClientRect();
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const btnsShowModal = document.querySelectorAll('.btn--show-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const images = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotsConatiner = document.querySelector('.dots');

const openModal = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = e => {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsShowModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

btn.addEventListener('click', () => {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

navLinks.addEventListener('click', e => {
  e.preventDefault();
  const target = e.target;
  if (target.classList.contains('nav__link')) {
    const blockID = target.getAttribute('href');

    const section = document.querySelector(blockID);
    section.scrollIntoView({
      behavior: 'smooth',
    });
  }
});

tabsContainer.addEventListener('click', e => {
  e.preventDefault();
  const target = e.target.closest('.operations__tab');

  if (!target) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  target.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${target.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(sib => {
      if (sib !== link) {
        sib.style.opacity = opacity;
        logo.style.opacity = opacity;
      }
    });
  }
};

nav.addEventListener('mouseover', e => {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', e => {
  handleHover(e, 1);
});

const styckyNav = entries => {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const observeOpt = {
  root: null,
  treshold: 0,
  rootMargin: `-${window.getComputedStyle(nav).height}`,
};

const headerObserver = new IntersectionObserver(styckyNav, observeOpt);
headerObserver.observe(header);

const revealSection = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserveOpt = {
  root: null,
  treshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
  revealSection,
  sectionObserveOpt
);

sections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

///// lazy loading

const loadImg = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

imgObsOpt = {
  root: null,
  treshold: 0,
  rootMargin: '-200px',
};

const imgObserever = new IntersectionObserver(loadImg, imgObsOpt);
images.forEach(img => imgObserever.observe(img));

(createSlider = () => {
  const createDots = () => {
    slides.forEach((_, i) => {
      dotsConatiner.insertAdjacentHTML(
        'beforeend',
        `
    <button class="dots__dot" data-slide="${i}"></button>
    `
      );
    });
  };

  const activatedDot = slide => {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');

      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active');
    });
  };

  const goToSLide = slide => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%`)
    );
  };

  let curSlide = 0;
  let maxSlide = slides.length;

  const nextSlide = () => {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSLide(curSlide);
    activatedDot(curSlide);
  };

  const prevSlide = () => {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSLide(curSlide);
    activatedDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotsConatiner.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSLide(slide);
      activatedDot(slide);
    }
  });
  const initSlider = () => {
    goToSLide(0);
    createDots();
    activatedDot(0);
  };
  initSlider();
})();
