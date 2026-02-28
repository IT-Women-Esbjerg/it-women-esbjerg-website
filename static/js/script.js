// Accordion functionality for event list
document.addEventListener('DOMContentLoaded', function () {
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
});
