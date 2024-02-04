const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm) {
  const URL = `http://www.omdbapi.com/?s=${searchTerm}&apikey=3d35a0a0`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = (movieSearchBox.value).trim();
  if(searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for(let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].imdbID;
    movieListItem.classList.add('search-list-item');
    if(movies[idx].Poster != "N/A")
      moviePoster = movies[idx].Poster;
    else
      moviePoster = "imagenotfound.png";

    movieListItem.innerHTML = `
    <div class="search-list-item">
            <div class="search-item-thumbnail">
              <img src="${movies[idx].Poster}" alt="">
            </div>
            <div class="search-item-info">
              <h3>${movies[idx].Title}</h3>
              <p>${movies[idx].Year}</p>
            </div>
            `;
    searchList.appendChild(movieListItem);
  }
  loadMoviesDetails();
}

function loadMoviesDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach(movie => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list');
      const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=3d35a0a0`);
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
  <div class="movie-poster">
  <img src="${(details.Poster != "N/A") ? details.Poster : "imagenotfound.jpg"}}" alt="movieposter">
</div>
<div class="movie-info">
  <h3 class="movie-title">${details.Title}</h3>
  <ul class="movie-misc-info">
    <li class="year">Year: ${details.Year}</li>
    <li class="rated">Ratings: ${details.Rated}</li>
    <li class="released">Released: ${details.Released}</li>
  </ul>
    <p class="genre"><b>Genre: ${details.Genre}</b></p>
    <p class="writer"><b>Writer: ${details.Writer}</b></p>
    <p class="actors"><b>Actors: ${details.Actors}</b></p>
    <p class="plot"><b>Plot: ${details.Plot}</b></p>
    <p class="language"><b>Language: ${details.Language}</b></p>
    <p class="awards"><b><i class="fa-solid fa-award"></i></b>${details.Awards}</p>
</div>
  `;
}

