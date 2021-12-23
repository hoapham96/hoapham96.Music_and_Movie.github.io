// Global variables
let apiKey = '1fcb095f3dea632c59c58e8920d44217';

// Page variables
let genreListEl = document.querySelector('#genres').children;
let movieListEl = document.querySelector('#movies');
let nextPageBtn = document.querySelector('#next');
let previousPageBtn = document.querySelector('#previous');
let pageNumber = document.querySelector('.pageNumber');
let homeBtn = document.querySelector('.home');

// Modal variables
let modalEl = document.querySelector('.modal');
let modalBg = document.querySelector('.modal-background');
let modalContent = document.querySelector('.content');
let modalBtn = document.querySelector('.modal-close');

// Counter variables
let pageNum = 1;
let moviePosters = 20;

let movieGenreNums = [
  28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770,
  53, 10752, 37,
];

// Genre click event starts the api call to list movie posters
for (let i = 0; i < movieGenreNums[i]; i++) {
  genreListEl[i].addEventListener('click', (event) => {
    localStorage.setItem('movieGenre', genreListEl[i].textContent);
    localStorage.setItem('genre', movieGenreNums[i]);
    if (localStorage.getItem('genre') == movieGenreNums[i]) {
      pageNum = 1;
      getMovieGenre();
    }
  });
}

// Api call
let getMovieGenre = () => {
  movieListEl.innerHTML = '';

  let apiUrl = ''.concat(
    'https://api.themoviedb.org/3/discover/movie?api_key=' +
      apiKey +
      '&with_genres=' +
      localStorage.getItem('genre') +
      '&language=en-US&adult=false&page=' +
      pageNum
  );

  fetch(apiUrl).then((response) => {
    if (response.ok) {
      response.json().then(function (data) {
        displayMovieData(data);
      });
    }
  });
};

// Adds second image to modal and activates link to movie website if available
var getMovieSite = () => {
  let apiUrl = ''.concat(
    'https://api.themoviedb.org/3/movie/' +
      localStorage.getItem('movieId') +
      '?api_key=' +
      apiKey +
      '&language=en-US'
  );
  fetch(apiUrl).then((response) => {
    if (response.ok) {
      response.json().then(function (data) {
        localStorage.setItem('backdrop', data.backdrop_path);
        localStorage.setItem('website', data.homepage);
        let modalImg = document.querySelector('.image');
        modalImg.setAttribute(
          'src',
          'https://image.tmdb.org/t/p/w342' + localStorage.getItem('backdrop')
        );
        if (localStorage.getItem('website') == '') {
          console.log('No website available');
        } else {
          let modalLink = document.querySelector('.link');
          modalLink.setAttribute('href', localStorage.getItem('website'));
        }
      });
    }
  });
};

// Displays movie data
var displayMovieData = (data) => {
  for (let i = 0; i < moviePosters; i++) {
    let movieInfoDiv = document.createElement('div');
    movieInfoDiv.setAttribute('id', 'movieDiv');
    movieInfoDiv.setAttribute(
      'style',
      'width: 342px; color: white; text-align: center'
    );
    movieInfoDiv.setAttribute('class', 'column is-one-fifth is-full-mobile');
    // This generates the posters and titles
    let displayMovies = document.createElement('img');
    displayMovies.setAttribute('id', data.results[i].title);
    displayMovies.setAttribute('class', 'is-clickable is-clipped');
    displayMovies.setAttribute(
      'src',
      'https://image.tmdb.org/t/p/w342' + data.results[i].poster_path
    );

    // Modal component
    displayMovies.addEventListener('click', () => {
      modalEl.classList.add('is-active');
      localStorage.setItem('movieTitle', data.results[i].title);
      localStorage.setItem('movieInfo', data.results[i].overview);
      localStorage.setItem('movieId', data.results[i].id);
      let movieTitle = document.querySelector('.title');
      movieTitle.textContent = data.results[i].title;
      let displayMovieOverview = document.querySelector('.content');
      displayMovieOverview.textContent = data.results[i].overview;

      getMovieSite();
    });

    // Adds posters to page
    localStorage.setItem('pageNumber', data.page);
    pageNumber.innerHTML =
      localStorage.getItem('movieGenre') +
      ' Page ' +
      localStorage.getItem('pageNumber');
    movieInfoDiv.append(displayMovies);
    movieListEl.append(movieInfoDiv);
  }
};

// Buttons for next page
nextPageBtn.addEventListener('click', () => {
  window.scrollTo(0, 0);
  pageNum++;
  movieListEl.innerHTML = '';
  getMovieGenre();
});

// Button for previous page
previousPageBtn.addEventListener('click', () => {
  window.scrollTo(0, 0);
  pageNum--;
  movieListEl.innerHTML = '';
  getMovieGenre();
});

// Modal event listeners
modalBg.addEventListener('click', () => {
  modalEl.classList.remove('is-active');
});

modalBtn.addEventListener('click', () => {
  modalEl.classList.remove('is-active');
});
