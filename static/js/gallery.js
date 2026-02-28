import { getAmountOfItemsToDisplay } from './shared.js';

/**
 * Sets up the navigation for the gallery images, allowing users to navigate through the list on smaller screens.
 */
function setUpGalleryNavigation() {
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    let startIndex = 0;

    if (!prevBtn || !nextBtn) {
        return;
    }

    prevBtn.addEventListener('click', function () {
        if (startIndex > 0) {
            startIndex--;
            renderGalleryImages(startIndex);
        }
    });

    nextBtn.addEventListener('click', function () {
        startIndex++;
        renderGalleryImages(startIndex);
    });

    // Re-render on resize to update images shown
    window.addEventListener('resize', function () {
        renderGalleryImages(startIndex);
    });
}

/**
 * Renders the gallery images based on the current start index and the number of items to display, and updates the navigation buttons accordingly.
 * @param {number} startIndex - The index of the first image to display in the gallery. Defaults to 0.
 * @returns 
 */
function renderGalleryImages(startIndex = 0) {
    const galleryDataElement = document.getElementById('gallery-data');
    if (!galleryDataElement) {
        // No gallery data on this page, skip gallery initialization
        return;
    }

    const escapedImagesText = galleryDataElement.textContent;
    const imagesText = JSON.parse(escapedImagesText);
    const images = JSON.parse(imagesText);

    const gallery = document.getElementById('gallery-images');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

    const imagesToShow = getAmountOfItemsToDisplay();
    // Adjust start index to prevent overflow
    if (startIndex + imagesToShow > images.length) {
        startIndex = Math.max(0, images.length - imagesToShow);
    }
    gallery.innerHTML = '';
    for (let i = 0; i < imagesToShow; i++) {
        const img = images[startIndex + i];
        if (!img) continue;

        const wrapper = document.createElement('div');
        wrapper.className = 'flex-1 flex justify-center items-center';
        let innerDiv, imgClass;
        if (imagesToShow === 1 || (imagesToShow === 3 && i === 1)) {
            innerDiv = document.createElement('div');
            innerDiv.className = 'w-full h-64 lg:h-80 border-4 border-primary rounded-xl overflow-hidden shadow-lg scale-105';
            imgClass = 'w-full h-full object-cover';
        } else {
            innerDiv = document.createElement('div');
            innerDiv.className = 'w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-md';
            imgClass = 'w-full h-full object-cover';
        }
        const image = document.createElement('img');
        image.src = img.url;
        image.alt = img.alt;
        image.className = imgClass;
        image.loading = 'lazy';
        innerDiv.appendChild(image);
        wrapper.appendChild(innerDiv);
        gallery.appendChild(wrapper);
    }
    prevBtn.disabled = startIndex === 0;
    nextBtn.disabled = startIndex + imagesToShow >= images.length;
    prevBtn.classList.toggle('opacity-50', prevBtn.disabled);
    prevBtn.classList.toggle('cursor-not-allowed', prevBtn.disabled);
    nextBtn.classList.toggle('opacity-50', nextBtn.disabled);
    nextBtn.classList.toggle('cursor-not-allowed', nextBtn.disabled);
}


document.addEventListener('DOMContentLoaded', function () {
    setUpGalleryNavigation();
    renderGalleryImages();
});