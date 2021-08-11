const btn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const initialCoords = section1.getBoundingClientRect();
const header = document.querySelector('.header');

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
