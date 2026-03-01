import { getAmountOfItemsToDisplay } from './shared.js';

// Slide size constants — must match getAmountOfItemsToDisplay
const SLIDE_SIZE_MOBILE = 1;
const SLIDE_SIZE_DESKTOP = 3;

/**
 * Builds all slide DOM nodes for a given slide size and appends them to the
 * gallery container, hidden. Returns the array of slide wrapper elements.
 * Slides are never removed from the DOM, so images stay decoded in memory.
 *
 * @param {object[]} images
 * @param {number} slideSize
 * @param {HTMLElement} gallery
 * @returns {HTMLElement[]} Array of slide wrapper divs, one per page.
 */
function buildSlides(images, slideSize, gallery) {
    const slides = [];
    for (let start = 0; start < images.length; start += slideSize) {
        const slide = document.createElement('div');
        slide.className = 'absolute inset-0 flex gap-4 justify-center items-center px-1';
        slide.hidden = true;

        for (let i = 0; i < slideSize; i++) {
            const img = images[start + i];
            if (!img) continue;

            const wrapper = document.createElement('div');
            let innerDiv;

            if (slideSize === 1) {
                // Mobile: single image, plain full-bleed, border frame
                wrapper.className = 'w-full h-full';
                innerDiv = document.createElement('div');
                innerDiv.className = 'w-full h-full border-4 border-primary rounded-xl overflow-hidden shadow-lg';
            } else if (i === 1) {
                // Desktop: center/highlighted image — larger flex share, border frame
                wrapper.className = 'flex-[3] flex justify-center items-center';
                innerDiv = document.createElement('div');
                innerDiv.className = 'w-full h-72 border-4 border-primary rounded-xl overflow-hidden shadow-lg';
            } else {
                // Desktop: side images — smaller flex share, plain style
                wrapper.className = 'flex-[2] flex justify-center items-center';
                innerDiv = document.createElement('div');
                innerDiv.className = 'w-full h-52 rounded-lg overflow-hidden shadow-md';
            }

            const image = document.createElement('img');
            image.src = img.url;
            image.alt = img.alt;
            image.className = 'w-full h-full object-cover';
            innerDiv.appendChild(image);
            wrapper.appendChild(innerDiv);
            slide.appendChild(wrapper);
        }

        gallery.appendChild(slide);
        slides.push(slide);
    }
    return slides;
}

/**
 * Shows the slide at the given index, animating in from the given direction,
 * and hides the previously visible slide.
 *
 * @param {HTMLElement[]} slides
 * @param {number} index
 * @param {'left'|'right'|null} direction
 */
function showSlide(slides, index, direction) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.hidden = false;
            if (direction) {
                const cls = direction === 'left' ? 'gallery-slide-in-left' : 'gallery-slide-in-right';
                slide.classList.remove('gallery-slide-in-left', 'gallery-slide-in-right');
                // Force reflow so the animation restarts if same class was applied before
                void slide.offsetWidth;
                slide.classList.add(cls);
            }
        } else {
            slide.hidden = true;
            slide.classList.remove('gallery-slide-in-left', 'gallery-slide-in-right');
        }
    });
}

/**
 * Initialises the gallery: builds all slides for both breakpoints up front,
 * shows only the correct set, and wires up navigation.
 */
function initGallery() {
    const galleryDataElement = document.getElementById('gallery-data');
    if (!galleryDataElement) return;

    const images = JSON.parse(JSON.parse(galleryDataElement.textContent));

    const gallery = document.getElementById('gallery-images');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

    if (!gallery || !prevBtn || !nextBtn) return;

    // Build all slides for both breakpoints once — images are decoded and cached
    const mobileSlides = buildSlides(images, SLIDE_SIZE_MOBILE, gallery);
    const desktopSlides = buildSlides(images, SLIDE_SIZE_DESKTOP, gallery);

    let currentIndex = 0;

    /**
     * Updates which set of slides is active for the current breakpoint,
     * shows the right slide, and refreshes button state.
     * @param {'left'|'right'|null} direction
     */
    function render(direction) {
        const isMobile = getAmountOfItemsToDisplay() === SLIDE_SIZE_MOBILE;
        const activeSlides = isMobile ? mobileSlides : desktopSlides;
        const inactiveSlides = isMobile ? desktopSlides : mobileSlides;

        // Ensure the inactive set is fully hidden
        inactiveSlides.forEach((s) => { s.hidden = true; });

        // Clamp index for the active slide set
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
        const isMobile = getAmountOfItemsToDisplay() === SLIDE_SIZE_MOBILE;
        const activeSlides = isMobile ? mobileSlides : desktopSlides;
        if (currentIndex < activeSlides.length - 1) {
            currentIndex++;
            render('left');
        }
    });

    window.addEventListener('resize', function () {
        render(null);
    });

    // Initial render — no animation
    render(null);
}


document.addEventListener('DOMContentLoaded', initGallery);