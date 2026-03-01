import { getAmountOfItemsToDisplay, showSlide } from './shared.js';

const SLIDE_SIZE_MOBILE = 1;

const GALLERY_DATA_ID = 'gallery-data';
const GALLERY_CONTAINER_ID = 'gallery-images';
const GALLERY_PREV_BTN_ID = 'gallery-prev';
const GALLERY_NEXT_BTN_ID = 'gallery-next';

/**
 * Builds one slide DOM node per image for mobile (single image per slide).
 *
 * @param {object[]} images
 * @param {HTMLElement} gallery
 * @returns {HTMLElement[]} Array of slide wrapper divs, one per image.
 */
function buildMobileSlides(images, gallery) {
    return images.map((img) => {
        const slide = document.createElement('div');
        slide.className = 'absolute inset-0 flex gap-4 justify-center items-center px-1';
        slide.hidden = true;

        const wrapper = document.createElement('div');
        wrapper.className = 'w-full h-full';
        const innerDiv = document.createElement('div');
        innerDiv.className = 'w-full h-full border-4 border-primary rounded-xl overflow-hidden shadow-lg';

        const image = document.createElement('img');
        image.src = img.url;
        image.alt = img.alt;
        image.className = 'w-full h-full object-cover';
        innerDiv.appendChild(image);
        wrapper.appendChild(innerDiv);
        slide.appendChild(wrapper);

        gallery.appendChild(slide);
        return slide;
    });
}

/**
 * Builds one slide DOM node per image for desktop. Each slide shows the image
 * at `centerIndex` in the highlighted center position, flanked by its
 * neighbours. This means every image can be the focused center image and
 * navigation advances by exactly one image at a time.
 *
 * @param {object[]} images
 * @param {HTMLElement} gallery
 * @returns {HTMLElement[]} Array of slide wrapper divs, one per image.
 */
function buildDesktopSlides(images, gallery) {
    return images.map((_, centerIndex) => {
        const slide = document.createElement('div');
        slide.className = 'absolute inset-0 flex gap-4 justify-center items-center px-1';
        slide.hidden = true;

        // Positions: [center-1, center, center+1], wrapping around for edge slides
        const imgIndices = [
            (centerIndex - 1 + images.length) % images.length,
            centerIndex,
            (centerIndex + 1) % images.length,
        ];

        imgIndices.forEach((imgIndex, position) => {
            const img = images[imgIndex];
            const wrapper = document.createElement('div');
            const innerDiv = document.createElement('div');

            if (position === 1) {
                // Center/highlighted image — larger flex share, border frame
                wrapper.className = 'flex-[3] flex justify-center items-center';
                innerDiv.className = 'w-full h-72 border-4 border-primary rounded-xl overflow-hidden shadow-lg';
            } else {
                // Side images — smaller flex share, plain style
                wrapper.className = 'flex-[2] flex justify-center items-center';
                innerDiv.className = 'w-full h-52 rounded-lg overflow-hidden shadow-md';
            }

            const image = document.createElement('img');
            image.src = img.url;
            image.alt = img.alt;
            image.className = 'w-full h-full object-cover';
            innerDiv.appendChild(image);
            wrapper.appendChild(innerDiv);
            slide.appendChild(wrapper);
        });

        gallery.appendChild(slide);
        return slide;
    });
}


/**
 * Initialises the gallery: builds all slides for both breakpoints up front,
 * shows only the correct set, and wires up navigation.
 */
function initGallery() {
    const galleryDataElement = document.getElementById(GALLERY_DATA_ID);
    if (!galleryDataElement) return;

    const images = JSON.parse(JSON.parse(galleryDataElement.textContent));

    const gallery = document.getElementById(GALLERY_CONTAINER_ID);
    const prevBtn = document.getElementById(GALLERY_PREV_BTN_ID);
    const nextBtn = document.getElementById(GALLERY_NEXT_BTN_ID);

    if (!gallery || !prevBtn || !nextBtn) return;

    // Build all slides for both breakpoints once — images are decoded and cached
    const mobileSlides = buildMobileSlides(images, gallery);
    const desktopSlides = buildDesktopSlides(images, gallery);

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

        // Wrap index for the active slide set (e.g. after a resize changes breakpoint)
        currentIndex = currentIndex % activeSlides.length;

        showSlide(activeSlides, currentIndex, direction);

        const single = activeSlides.length <= 1;
        prevBtn.disabled = single;
        nextBtn.disabled = single;
        prevBtn.classList.toggle('opacity-50', single);
        prevBtn.classList.toggle('cursor-not-allowed', single);
        nextBtn.classList.toggle('opacity-50', single);
        nextBtn.classList.toggle('cursor-not-allowed', single);
    }

    prevBtn.addEventListener('click', function () {
        const isMobile = getAmountOfItemsToDisplay() === SLIDE_SIZE_MOBILE;
        const activeSlides = isMobile ? mobileSlides : desktopSlides;
        currentIndex = (currentIndex - 1 + activeSlides.length) % activeSlides.length;
        render('right');
    });

    nextBtn.addEventListener('click', function () {
        const isMobile = getAmountOfItemsToDisplay() === SLIDE_SIZE_MOBILE;
        const activeSlides = isMobile ? mobileSlides : desktopSlides;
        currentIndex = (currentIndex + 1) % activeSlides.length;
        render('left');
    });

    window.addEventListener('resize', function () {
        render(null);
    });

    // Initial render — no animation
    render(null);
}


document.addEventListener('DOMContentLoaded', initGallery);