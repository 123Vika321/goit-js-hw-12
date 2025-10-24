import './css/reset.css';
import './css/base.css';
import './css/styles.css';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const loadMoreBtn = document.getElementById('load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;
const perPage = 15;

hideLoadMoreButton();

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  currentQuery = input.value.trim();
  if (!currentQuery) {
    iziToast.error({ title: 'Error', message: 'Please enter a search term.' });
    return;
  }

  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data.hits || data.hits.length === 0) {
      iziToast.info({ title: 'No results', message: 'No images found.' });
      return;
    }

    totalHits = data.totalHits;
    createGallery(data.hits);

    if (totalHits > currentPage * perPage) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (err) {
    console.error(err);
    iziToast.error({ title: 'Error', message: 'Something went wrong.' });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  currentPage += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data.hits || data.hits.length === 0) {
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
      });
      hideLoadMoreButton();
      return;
    }

    createGallery(data.hits);

    if (totalHits > currentPage * perPage) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    const galleryItem = document.querySelector('.gallery li');
    if (galleryItem) {
      const { height: cardHeight } = galleryItem.getBoundingClientRect();
      window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
    }
  } catch (err) {
    console.error(err);
    iziToast.error({ title: 'Error', message: 'Something went wrong.' });
  } finally {
    hideLoader();
  }
}
