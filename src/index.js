import './sass/main.scss';
import _default from '../node_modules/simplelightbox/dist/simple-lightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const input = document.querySelector('input[type="text"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('button');

loadMoreBtn.style.display = 'none';
let page = 1;
let totalHits = 0;
let leftHits;

async function getPhoto(name, pageNumber) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=23709180-349fcff3bbc1fea5bbf1858d4&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`,
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const findImages = () => {
  getPhoto(input.value, page)
    .then(photos => {
      if (page < 1) {
        gallery.innerHTML = '';
      } else if (page >= 1) {
        loadMoreBtn.style.display = 'block';
        if (leftHits <= 0) {
          loadMoreBtn.style.display = 'none';
          Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
        }
      }
      renderImages(photos);
      page += 1;
      leftHits = totalHits - page * 40;
    })
    .catch(err => {
      console.log(err);
    });
};
function renderImages(photos) {
  totalHits = photos.totalHits;
  if (page <= 1) {
    leftHits = totalHits;
    if (totalHits <= 0) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`,
      );
      loadMoreBtn.style.display = 'none';
    } else {
      Notiflix.Notify.success(`Found ${photos.totalHits} images`);
    }
  }
  const markup = photos.hits
    .map(hit => {
      return `<div class="photo-card">
      <a class="gallery__item" href="${hit.largeImageURL}"> <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <p><b>Likes</b> <br>${hit.likes}</br></p>
        </p>
        <p class="info-item">
          <p><b>Views</b> <br>${hit.views}</br></p>
        </p>
        <p class="info-item">
          <p><b>Comments</b> <br>${hit.comments}</br></p>
        </p>
        <p class="info-item">
          <p><b>Downloads</b> <br>${hit.downloads}</br></p>
        </p>
      </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  if (pageNumber > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery .photo-card')
      .getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  let lightbox = new SimpleLightbox('.gallery a', {
    captionPosition: 'outside',
    captionsData: 'alt',
    captionDelay: '250',
  });
}

const newSearch = e => {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  findImages();
};

const loadMore = e => {
  e.preventDefault();
  findImages();
};

searchBtn.addEventListener('click', newSearch);
loadMoreBtn.addEventListener('click', loadMore);
