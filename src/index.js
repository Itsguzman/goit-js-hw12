import { fetchSearch } from './search-api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const submitQuery = document.getElementById('search-form');
const listLoader = document.querySelector('.loader');
const loadMoreBtn = document.getElementById('loadMore');
let currentPage = 1; // Reset current page on new search
let countMe = 0;

async function searchNow(e) {
  e.preventDefault();
  listLoader.classList.remove('is-hidden');
  let searchQuery = document
    .querySelector("input[name='searchQuery']")
    .value.trim();

  try {
    const searchResult = await fetchSearch(searchQuery, currentPage);
    console.log(searchResult);

    let finalResult = searchResult.hits.map(result => {
      return `<div class="photo-card">
            <a class="gallery__link" href="${result.largeImageURL}">
                <img src="${result.webformatURL}" alt="${result.tags}" loading="lazy" class="itemPhoto"/>
            </a>
            <div class="info">
                <p class="info-item">
                <b>Likes</b>
                <span>${result.likes}</span>
                </p>
                <p class="info-item">
                <b>Views</b>
                <span>${result.views}</span>
                </p>
                <p class="info-item">
                <b>Comments</b>
                <span>${result.comments}</span>
                </p>
                <p class="info-item">
                <b>Downloads</b>
                <span>${result.downloads}</span>
                </p>
            </div>
        </div>`;
    });
    gallery.insertAdjacentHTML('beforeend', finalResult.join(''));
    listLoader.classList.add('is-hidden');

    if (searchResult.totalHits > 0) {
      Notiflix.Notify.success(
        'Hooray! We found ' + searchResult.totalHits + ' images.'
      );
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    }

    let lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    lightbox.on('show.simplelightbox');
  } catch (error) {
    console.error('Error fetching breeds:', error);
  }
}

submitQuery.addEventListener('submit', e => {
  e.preventDefault();
  currentPage = 1;
  gallery.innerHTML = '';
  searchNow(e);
});

loadMoreBtn.addEventListener('click', e => {
  e.preventDefault();
  currentPage++;
  searchNow(e);
});

function isBottom() {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

window.addEventListener('scroll', () => {
  if (isBottom()) {
    loadMoreBtn.click();
  }
});
