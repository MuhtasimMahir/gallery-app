let images = [];
let deleteButton = document.querySelector('#delete-btn');
let gallery = document.querySelector('.gallery');
let timeoutId;
let mouseDown = false;
let fullscreenImages = [];

let fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', () => {
    images = images.concat(Array.from(fileInput.files));
});

let uploadBtn = document.getElementById('upload-btn');
uploadBtn.addEventListener('click', () => {
    gallery.innerHTML = '';
    for (let i = 0; i < images.length; i++) {
        let imageContainer = document.createElement('div');
        imageContainer.classList.add('gallery-image-container');
        let image = document.createElement('img');
        image.src = URL.createObjectURL(images[i]);
        image.classList.add('gallery-image');
        imageContainer.appendChild(image);
        imageContainer.addEventListener('mousedown', selectImage);
        imageContainer.addEventListener('mouseup', cancelSelectImage);
        gallery.appendChild(imageContainer);
    }
});

function selectImage(event) {
    mouseDown = true;
    const image = event.currentTarget.querySelector('.gallery-image');
    timeoutId = setTimeout(() => {
        image.classList.toggle('selected');
        const selectedImages = document.querySelectorAll('.gallery-image.selected');
        // if (selectedImages.length > 0) {
        //     deleteButton.style.display = 'block';
        // } else {
        //     deleteButton.style.display = 'none';
        // }
    }, 1000);
}

function cancelSelectImage() {
    mouseDown = false;
    clearTimeout(timeoutId);
}

let deleteSelectedImages = () => {
    const selectedImages = document.querySelectorAll('.gallery-image.selected');
    selectedImages.forEach(selectedImage => {
        const imageContainer = selectedImage.closest('.gallery-image-container');
        imageContainer.remove();
        images.splice(images.indexOf(selectedImage), 1);
        //deleteButton.style.display = 'none';
    });
}

deleteButton.addEventListener('click', (deleteSelectedImages));

document.addEventListener('click', (event) => {
    if (event.target.tagName === 'IMG' && !event.target.classList.contains('selected') && !mouseDown) {
        showGalleryView(event.target);
    }
});

function showGalleryView(image) {
    let view = document.createElement('div');
    view.classList.add('gallery-view');
    view.innerHTML = `
        <img src="${image.src}" class="gallery-view-image">
        <div class="gallery-view-nav">
            <button class="gallery-view-prev-btn">&lt;</button>
            <button class="gallery-view-next-btn">&gt;</button>
        </div>
        <div class="close-btn">&times;</div>
    `;
    document.body.appendChild(view);
    let closeBtn = view.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(view);
        fullscreenImages.forEach(fullscreenImage => {
            fullscreenImage.parentElement.removeChild(fullscreenImage);
        });
        fullscreenImages = [];

        
    });

    let prevBtn = view.querySelector('.gallery-view-prev-btn');
    let nextBtn = view.querySelector('.gallery-view-next-btn');
    let currentIndex = Array.from(gallery.querySelectorAll('.gallery-image')).findIndex((img) => img.src === image.src);
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            showImageAtIndex(currentIndex);
        }
    });
    
    
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showImageAtIndex(currentIndex);
        }
    });

    function showImageAtIndex(index) {
        let galleryViewImage = view.querySelector('.gallery-view-image');
        galleryViewImage.src = URL.createObjectURL(images[index]);
        currentIndex = index;
        let fullscreenImage = galleryViewImage.cloneNode(true);
        fullscreenImage.classList.add('fullscreen-image');
        document.body.appendChild(fullscreenImage);
        fullscreenImages.push(fullscreenImage);
    }

    function exitFullScreen() {
    fullscreenImages.forEach(fullscreenImage => {
    fullscreenImage.parentElement.removeChild(fullscreenImage);
    });
    fullscreenImages = [];
    }
    
    document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
    exitFullScreen();
    }
    });
    
    document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
    exitFullScreen();
    }
    });
    
    document.addEventListener('webkitfullscreenchange', () => {
    if (!document.webkitFullscreenElement) {
    exitFullScreen();
    }
    });
    
    document.addEventListener('mozfullscreenchange', () => {
    if (!document.mozFullScreenElement) {
    exitFullScreen();
    }
    });
    
    document.addEventListener('msfullscreenchange', () => {
    if (!document.msFullscreenElement) {
    exitFullScreen();
    }
    });
    
    document.addEventListener('touchstart', (event) => {
    if (event.touches.length === 2) {
    event.preventDefault();
    document.documentElement.requestFullscreen();
    }
    });
    
    document.addEventListener('wheel', (event) => {
    if (event.ctrlKey) {
    event.preventDefault();
    event.stopPropagation();
    if (event.deltaY > 0) {
    document.documentElement.style.fontSize = '16px';
    } else {
    document.documentElement.style.fontSize = '14px';
    }
    }
    });
    
    window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = '';
    });
    
    window.addEventListener('unload', () => {
    localStorage.setItem('gallery-images', JSON.stringify(images));
    });
    
    window.addEventListener('load', () => {
    let storedImages = JSON.parse(localStorage.getItem('gallery-images'));
    if (storedImages) {
    images = images.concat(storedImages);
    uploadBtn.click();
    }
    });
    
    window.addEventListener('resize', () => {
    let view = document.querySelector('.gallery-view');
    if (view) {
    let galleryViewImage = view.querySelector('.gallery-view-image');
    let currentIndex = Array.from(gallery.querySelectorAll('.gallery-image')).findIndex((img) => img.src === galleryViewImage.src);
    showImageAtIndex(currentIndex);
    }
    });
}