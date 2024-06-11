'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const OpTabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const opTabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const featuresImages = document.querySelectorAll('.features__img');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth scroll
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Operation Section ==> Tab
OpTabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //Remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  opTabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate clicked tab and content
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    console.log(link);
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    console.log(siblings);
    const logo = link.closest('.nav').querySelector('.nav__logo');
    console.log(logo);

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

// Nav opacity style
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Nav

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Intersection Observer API

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries, navObserver) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const navObserver = new IntersectionObserver(stickyNav, obsOptions);
navObserver.observe(header);

//Revealing Sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const revealOption = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, revealOption);

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images

const lazyLoader = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};

const imgOptions = {
  root: null,
  threshold: 0,
};
const imageObserver = new IntersectionObserver(lazyLoader, imgOptions);

featuresImages.forEach(img => {
  imageObserver.observe(img);
  img.classList.add('lazy-img');
});

//Slider
let curSlide = 0;
const maxSlide = slides.length - 1;

//Functions

const goToSlide = function (currentSlide) {
  //0,100%,200%,300%
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - currentSlide) * 100}%)`)
  );
};

const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

//Next slide
const nextSlide = function () {
  //if curSlide=0: -100%,0,100%,200%
  if (curSlide === maxSlide) curSlide = 0;
  else curSlide++;
  goToSlide(curSlide);
  activateDot(curSlide);
};

//Previous slide
const prevSlide = function () {
  if (curSlide === 0) curSlide = maxSlide;
  else curSlide--;
  goToSlide(curSlide);
  activateDot(curSlide);
};

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
});

//Activate Dot
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

//Changing slide by clicking on dots
dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

const init = function () {
  goToSlide(0);
  createDots(0);
  activateDot(0);
};

init();
btnSliderRight.addEventListener('click', nextSlide);
btnSliderLeft.addEventListener('click', prevSlide);
