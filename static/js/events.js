import { getAmountOfItemsToDisplay, showSlide } from './shared.js';

const ITEMS_MOBILE = 1;
const ITEMS_DESKTOP = 3;

/**
 * Builds all slide DOM nodes for a given page size and appends them to the
 * container, hidden. Returns the array of slide elements.
 *
 * @param {string[]} items
 * @param {number} pageSize
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
function buildTakeawaySlides(items, pageSize, container) {
    const slides = [];
    for (let start = 0; start < items.length; start += pageSize) {
        const slide = document.createElement('div');
        slide.className = 'flex gap-2 items-stretch w-full';
        slide.hidden = true;

        for (let i = 0; i < pageSize; i++) {
            const item = items[start + i];
            if (!item) continue;
            const li = document.createElement('li');
            li.className = 'bg-background-alt p-4 rounded-lg flex-1 wrap-break-words';
            li.textContent = item;
            slide.appendChild(li);
        }

        container.appendChild(slide);
        slides.push(slide);
    }
    return slides;
}

const EVENT_DETAIL_PREFIX = 'event-detail-list';
const EVENT_DETAIL_DATA_ID = `${EVENT_DETAIL_PREFIX}-data`;
const EVENT_DETAIL_CONTAINER_ID = `${EVENT_DETAIL_PREFIX}-points`;
const EVENT_DETAIL_PREV_BTN_ID = `${EVENT_DETAIL_PREFIX}-prev`;
const EVENT_DETAIL_NEXT_BTN_ID = `${EVENT_DETAIL_PREFIX}-next`;

const EVENT_ACCORDION_CLASS = '.event-accordion';
const EVENT_ACCORDION_TOGGLE_CLASS = '.event-accordion-toggle';
const EVENT_ACCORDION_DETAILS_CLASS = '.event-accordion-details';


/**
 * Initialises the takeaways/plans carousel: builds all slides for both
 * breakpoints up front and wires up navigation.
 */
function initEventTakeaways() {
    const dataEl = document.getElementById(EVENT_DETAIL_DATA_ID);
    if (!dataEl) return;

    const items = JSON.parse(JSON.parse(dataEl.textContent));
    if (!items.length) return;

    const listContainer = document.getElementById(EVENT_DETAIL_CONTAINER_ID);
    const prevBtn = document.getElementById(EVENT_DETAIL_PREV_BTN_ID);
    const nextBtn = document.getElementById(EVENT_DETAIL_NEXT_BTN_ID);

    if (!listContainer || !prevBtn || !nextBtn) return;

    const mobileSlides = buildTakeawaySlides(items, ITEMS_MOBILE, listContainer);
    const desktopSlides = buildTakeawaySlides(items, ITEMS_DESKTOP, listContainer);

    let currentIndex = 0;

    function render(direction) {
        const isMobile = getAmountOfItemsToDisplay() === ITEMS_MOBILE;
        const activeSlides = isMobile ? mobileSlides : desktopSlides;
        const inactiveSlides = isMobile ? desktopSlides : mobileSlides;

        inactiveSlides.forEach((s) => { s.hidden = true; });

        if (currentIndex >= activeSlides.length) {
            currentIndex = activeSlides.length - 1;
        }

        showSlide(activeSlides, currentIndex, direction);

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= activeSlides.length - 1;
        prevBtn.classList.toggle('opacity-50', prevBtn.disabled);
        prevBtn.classList.toggle('cursor-not-allowed', prevBtn.disabled);
        nextBtn.classList.toggle('opacity-50', nextBtn.disabled);
        nextBtn.classList.toggle('cursor-not-allowed', nextBtn.disabled);
    }

    prevBtn.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            render('right');
        }
    });

    nextBtn.addEventListener('click', function () {
        const isMobile = getAmountOfItemsToDisplay() === ITEMS_MOBILE;
        const activeSlides = isMobile ? mobileSlides : desktopSlides;
        if (currentIndex < activeSlides.length - 1) {
            currentIndex++;
            render('left');
        }
    });

    window.addEventListener('resize', function () {
        render(null);
    });

    render(null);
}

/**
 * Renders the accordions for the event list, allowing only one to be open at a time and adding smooth animations.
 */
function renderEventListAccordions() {
    const accordions = document.querySelectorAll(EVENT_ACCORDION_CLASS);
    accordions.forEach(function (accordion) {
        const toggle = accordion.querySelector(EVENT_ACCORDION_TOGGLE_CLASS);
        const details = accordion.querySelector(EVENT_ACCORDION_DETAILS_CLASS);
        const chevron = toggle ? toggle.querySelector('svg') : null;
        if (toggle && details) {
            toggle.addEventListener('click', function (e) {
                // Close all other accordions
                accordions.forEach(function (otherAccordion) {
                    if (otherAccordion !== accordion) {
                        closeAccordion(otherAccordion);
                    }
                });
                // Toggle this accordion with animation
                const isOpen = details.classList.contains('open');
                if (isOpen) {
                    details.classList.remove('open');
                    setTimeout(() => details.classList.add('hidden'), 300);
                } else {
                    details.classList.remove('hidden');
                    setTimeout(() => details.classList.add('open'), 10);
                }
                const expanded = !isOpen;
                toggle.setAttribute('aria-expanded', expanded);
                if (chevron) {
                    chevron.style.transform = expanded ? 'rotate(180deg)' : '';
                }
            });
        }
    });
}

/**
 * Closes the given accordion with animation.
 * @param {HTMLElement} accordion 
 */
function closeAccordion(accordion) {
    const otherDetails = accordion.querySelector(EVENT_ACCORDION_DETAILS_CLASS);
    const otherToggle = accordion.querySelector(EVENT_ACCORDION_TOGGLE_CLASS);
    const otherChevron = otherToggle ? otherToggle.querySelector('svg') : null;
    if (otherDetails && (otherDetails.classList.contains('open') || !otherDetails.classList.contains('hidden'))) {
        otherDetails.classList.remove('open');
        setTimeout(() => otherDetails.classList.add('hidden'), 300);
        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
        if (otherChevron) otherChevron.style.transform = '';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    initEventTakeaways();
    renderEventListAccordions();
});
