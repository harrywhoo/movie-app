const global = {
    currentPage: window.location.pathname
}

const moviesGrid = document.querySelector("#popular-movies")
const showsGrid = document.querySelector("#popular-shows")


async function displayPopularMovies() {
    const { results } = await fetchAPIData("movie/popular")
    results.forEach(({ title, poster_path, id, release_date }) => {
        const div = document.createElement("div")
        div.classList.add("card")
        div.innerHTML = `   
          <a href="movie-details.html?id=${id}">
            ${poster_path ?
                `<img
                    src="https://image.tmdb.org/t/p/w500${poster_path}"
                    class="card-img-top"
                    alt="${title}"
                />` :
                `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${title}"
                />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${release_date}</small>
            </p>
          </div>
        `
        moviesGrid.appendChild(div)
    })
}

async function displayPopularShows() {
    const { results } = await fetchAPIData("tv/popular")
    results.forEach(({ name, poster_path, id, first_air_date }) => {
        const div = document.createElement("div")
        div.classList.add("card")
        div.innerHTML = `  
          <a href="tv-details.html?id=${id}">
          ${poster_path ?
                `<img
                src="https://image.tmdb.org/t/p/w500${poster_path}"
                class="card-img-top"
                alt="${name}"
            />` :
                `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${first_air_date}</small>
            </p>
          </div>
          <a href="movie-details.html?id=${id}">
        `
        showsGrid.appendChild(div)
    })
}

async function displayMovieDetails() {
    movieID = window.location.search.split("=")[1]
    const movie = await fetchAPIData(`movie/${movieID}`)
    displayBackgroundImage('movie', movie.backdrop_path )
    const topDiv = document.createElement("div")
    topDiv.classList.add("details-top")
    topDiv.innerHTML = `
        <div>
        ${movie.poster_path ?
            `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.original_title}"
            />` :
            `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${movie.original_title}"
            />`
        }
        
        </div>
        <div>
        <h2>${movie.original_title}</h2>
        <p>
            <i class="fas fa-star text-primary"></i>
            ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>
            ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
            ${movie.genres.map((genre) => `<li>${genre.name}
                </li>`).join('')}
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>`
    const botDiv = document.createElement("div")
    botDiv.classList.add("details-bottom")
    botDiv.innerHTML = `
        <h2>Movie Info</h2>
        <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommas(movie.budget)}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommas(movie.revenue)}</li>
        <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${movie.production_companies.map((company) => 
            `<span>${company.name}</span>`
        ).join(', ')}</div>`

    document.querySelector("#movie-details").appendChild(topDiv)
    document.querySelector("#movie-details").appendChild(botDiv)
}

async function displayTVDetails() {
    TVID = window.location.search.split("=")[1]
    const show = await fetchAPIData(`tv/${TVID}`)
    displayBackgroundImage('tv', show.backdrop_path )
    const topDiv = document.createElement("div")
    topDiv.classList.add("details-top")
    topDiv.innerHTML = `
        <div>
        ${show.poster_path ?
            `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
            />` :
            `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
            />`
        }
        
        </div>
        <div>
        <h2>${show.name}</h2>
        <p>
            <i class="fas fa-star text-primary"></i>
            ${show.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${show.last_air_date}</p>
        <p>
            ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
            ${show.genres.map((genre) => `<li>${genre.name}
                </li>`).join('')}
        </ul>
        <a href="${show.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>`
    const botDiv = document.createElement("div")
    botDiv.classList.add("details-bottom")
    botDiv.innerHTML = `
        <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode To Air:</span> ${
      show.last_episode_to_air.name
    }</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}
  </div>`
    document.querySelector("#show-details").appendChild(topDiv)
    document.querySelector("#show-details").appendChild(botDiv)
}


async function fetchAPIData(endpoint) {
    const API_KEY = "fb60e5fe4689ef081597de41af4d11e6"
    const API_URL = "https://api.themoviedb.org/3/"
    showSpinner()
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`)

    const data = await response.json()
    hideSpinner()
    return data
}

function addCommas(num){
    return num.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")
}
function showSpinner() {
    const spinner = document.querySelector(".spinner")
    spinner.classList.add("show")
}

function hideSpinner() {
    const spinner = document.querySelector(".spinner")
    spinner.classList.remove("show")
}

function displayBackgroundImage(type, backdrop_path){
    const overlayDiv = document.createElement("div")
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backdrop_path})`
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';
    switch (type){
        case 'movie':
            document.querySelector('#movie-details').appendChild(overlayDiv);
            break
        case 'tv':
            document.querySelector('#show-details').appendChild(overlayDiv);
            break
    }
}

async function displaySlider() {
    const { results } = await fetchAPIData('movie/now_playing');
  
    results.forEach((movie) => {
      const div = document.createElement('div');
      div.classList.add('swiper-slide');
  
      div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
        </h4>
      `;
  
      document.querySelector('.swiper-wrapper').appendChild(div);
  
      initSwiper();
    });
  }

  function initSwiper() {
    const swiper = new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      freeMode: true,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        500: {
          slidesPerView: 2,
        },
        700: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 4,
        },
      },
    });
  }

function highlightActiveLink() {
    const links = document.querySelectorAll(".nav-link")
    links.forEach((link) => {
        if (link.getAttribute("href") === global.currentPage) {
            link.classList.add("active")
        }
    })
}

function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            displaySlider()
            displayPopularMovies()
            break
        case "/shows.html":
            displayPopularShows()
            break
        case "/movie-details.html":
            displayMovieDetails()
            break
        case "/tv-details.html":
            displayTVDetails()
            break
        case "/search.html":
            break
    }
    highlightActiveLink()

}


document.addEventListener("DOMContentLoaded", init)