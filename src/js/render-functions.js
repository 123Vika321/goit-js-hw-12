import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');
const loader = document.getElementById('loader');
const loadMoreButton = document.getElementById('load-more');

export function createGallery(images) {
  const markup = images
    .map(
      img => `
        <li class="gallery-item">
          <a href="${img.largeImageURL}">
            <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p><b>Likes:</b> ${img.likes}</p>
            <p><b>Views:</b> ${img.views}</p>
            <p><b>Comments:</b> ${img.comments}</p>
            <p><b>Downloads:</b> ${img.downloads}</p>
          </div>
        </li>`
    )
    .join('');

  galleryContainer.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

export function clearGallery() {
  galleryContainer.innerHTML = '';
}

export function showLoader() {
  loader.classList.remove('hidden');
}

export function hideLoader() {
  loader.classList.add('hidden');
}

export function showLoadMoreButton() {
  loadMoreButton.classList.remove('hidden');
}

export function hideLoadMoreButton() {
  loadMoreButton.classList.add('hidden');
}
