let images = [];
let deleteButton = document.querySelector('#delete-btn');
let gallery = document.querySelector('.gallery');
let timeoutId;
let mouseDown = false;

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
        // deleteButton.style.display = 'none';
    });
}

deleteButton.addEventListener('click', deleteSelectedImages);

document.addEventListener('click', (event) => {
    if (event.target.tagName === 'IMG' && !event.target.classList.contains('selected') && !mouseDown) {
        showGalleryView(event.target.src);
    }
});

function showGalleryView(src) {
    let view = document.createElement('div');
    view.classList.add('gallery-view');
    view.innerHTML = `<img src="${src}"> <div class="close-btn">&times;</div>`;
    document.body.appendChild(view);
    let closeBtn = view.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(view);
    });
}

document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('selected')) {
        const selectedImages = document.querySelectorAll('.gallery-image.selected');
        selectedImages.forEach(selectedImage => {
            selectedImage.classList.remove('selected');
        });
        // deleteButton.style.display = 'none';
    }
});