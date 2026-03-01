export function getAmountOfItemsToDisplay() {
    // Tailwind's md breakpoint
    return window.innerWidth >= 768 ? 3 : 1;
}

// Carousel logic

/**
 * Shows the slide at the given index, animating in from the given direction,
 * and hides the previously visible slide.
 *
 * @param {HTMLElement[]} slides
 * @param {number} index
 * @param {'left'|'right'|null} direction
 */
export function showSlide(slides, index, direction) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.hidden = false;
            if (direction) {
                const cls = direction === 'left' ? 'carousel-slide-in-left' : 'carousel-slide-in-right';
                slide.classList.remove('carousel-slide-in-left', 'carousel-slide-in-right');
                // Force reflow so the animation restarts if same class was applied before
                void slide.offsetWidth;
                slide.classList.add(cls);
            }
        } else {
            slide.hidden = true;
            slide.classList.remove('carousel-slide-in-left', 'carousel-slide-in-right');
        }
    });
}