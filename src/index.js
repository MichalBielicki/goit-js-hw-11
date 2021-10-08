import './sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const input = document.querySelector('input[type="text"]');
const searchBtn = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const photoCard = document.querySelector('.photo-card');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none';
let page = 1;

async function getPhoto(input, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=23709180-349fcff3bbc1fea5bbf1858d4&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`,
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
