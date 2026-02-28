import { getAmountOfItemsToDisplay } from './shared.js';

/**
 * Sets up the navigation for the event takeaways list, allowing users to navigate through the list on smaller screens.
 */
function setUpEventTakeawaysNavigation() {
    const prevBtn = document.getElementById('event-detail-list-prev');
    const nextBtn = document.getElementById('event-detail-list-next');
    let startIndex = 0;

    if (!prevBtn || !nextBtn) {
        return;
    }

    prevBtn.addEventListener('click', function () {
        if (startIndex > 0) {
            startIndex--;
            renderEventTakeaways(startIndex);
        }
    });

    nextBtn.addEventListener('click', function () {
        startIndex++;
        renderEventTakeaways(startIndex);
    });

    // Re-render on resize to update items shown
    window.addEventListener('resize', function () {
        renderEventTakeaways(startIndex);
    });
}

/**
 * Renders the event takeaways list based on the current start index and the number of items to display, and updates the navigation buttons accordingly.
 * @param {number} startIndex - The index of the first item to display in the list. Defaults to 0.
 * @returns 
 */
function renderEventTakeaways(startIndex = 0) {
    const takeawayItems = document.getElementById('event-detail-list-data');
    if (!takeawayItems) {
        return;
    }

    const escapedText = takeawayItems.textContent;
    const itemsText = JSON.parse(escapedText);
    const items = JSON.parse(itemsText);
    const listContainer = document.getElementById('event-detail-list-points');

    const prevBtn = document.getElementById('event-detail-list-prev');
    const nextBtn = document.getElementById('event-detail-list-next');

    const itemsToShow = getAmountOfItemsToDisplay();
    if (startIndex + itemsToShow > items.length) {
        startIndex = Math.max(0, items.length - itemsToShow);
    }
    listContainer.innerHTML = '';
    for (let i = 0; i < itemsToShow; i++) {
        const item = items[startIndex + i];
        if (!item) continue;
        const li = document.createElement('li');
        li.className = 'bg-background-alt p-4 rounded-lg w-full sm:flex-1 wrap-break-words';
        li.textContent = item;
        listContainer.appendChild(li);
    }

    prevBtn.disabled = startIndex === 0;
    nextBtn.disabled = startIndex + itemsToShow >= items.length;
    prevBtn.classList.toggle('opacity-50', prevBtn.disabled);
    prevBtn.classList.toggle('cursor-not-allowed', prevBtn.disabled);
    nextBtn.classList.toggle('opacity-50', nextBtn.disabled);
    nextBtn.classList.toggle('cursor-not-allowed', nextBtn.disabled);
}

/**
 * Renders the accordions for the event list, allowing only one to be open at a time and adding smooth animations.
 */
function renderEventListAccordions() {
    const accordions = document.querySelectorAll('.event-accordion');
    accordions.forEach(function (accordion) {
        const toggle = accordion.querySelector('.event-accordion-toggle');
        const details = accordion.querySelector('.event-accordion-details');
        const chevron = toggle ? toggle.querySelector('svg') : null;
        if (toggle && details) {
            toggle.addEventListener('click', function (e) {
                // Close all other accordions
                accordions.forEach(function (otherAccordion) {
                    if (otherAccordion !== accordion) {
                        const otherDetails = otherAccordion.querySelector('.event-accordion-details');
                        const otherToggle = otherAccordion.querySelector('.event-accordion-toggle');
                        const otherChevron = otherToggle ? otherToggle.querySelector('svg') : null;
                        if (otherDetails && (otherDetails.classList.contains('open') || !otherDetails.classList.contains('hidden'))) {
                            otherDetails.classList.remove('open');
                            setTimeout(() => otherDetails.classList.add('hidden'), 300);
                            if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                            if (otherChevron) otherChevron.style.transform = '';
                        }
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


document.addEventListener('DOMContentLoaded', function () {
    setUpEventTakeawaysNavigation();
    renderEventTakeaways();
    renderEventListAccordions();
});
