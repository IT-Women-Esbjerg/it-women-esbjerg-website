document.addEventListener('DOMContentLoaded', function () {
    const escapedImagesText = document.getElementById('gallery-data').textContent;
    const imagesText = JSON.parse(escapedImagesText);
    const images = JSON.parse(imagesText);
    let start = 0;
    const gallery = document.getElementById('gallery-images');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

    function render() {
        gallery.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const img = images[start + i];
            if (!img) continue;

            const wrapper = document.createElement('div');
            wrapper.className = 'flex-1 flex justify-center items-center';
            let innerDiv, imgClass;
            if (i === 1) {
                innerDiv = document.createElement('div');
                innerDiv.className = 'w-full h-64 md:h-80 border-4 border-primary rounded-xl overflow-hidden shadow-lg scale-105';
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
        prevBtn.disabled = start === 0;
        nextBtn.disabled = start + 3 >= images.length;
        prevBtn.classList.toggle('opacity-50', prevBtn.disabled);
        prevBtn.classList.toggle('cursor-not-allowed', prevBtn.disabled);
        nextBtn.classList.toggle('opacity-50', nextBtn.disabled);
        nextBtn.classList.toggle('cursor-not-allowed', nextBtn.disabled);
    }

    prevBtn.addEventListener('click', function () {
        if (start > 0) {
            start--;
            render();
        }
    });
    nextBtn.addEventListener('click', function () {
        if (start + 3 < images.length) {
            start++;
            render();
        }
    });

    render();
});