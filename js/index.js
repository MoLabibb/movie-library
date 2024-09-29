const api_key = '0b913a4dcf407f4e1fe0a3d2ac4234dc'; 
const api_token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYjkxM2E0ZGNmNDA3ZjRlMWZlMGEzZDJhYzQyMzRkYyIsIm5iZiI6MTcyNzIwOTU3My41MDY1MDMsInN1YiI6IjY2ZjFhYzMwYzIzNzI1OGU0YzI2YTY5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.flUnHpahvEaIqvyfh_e21y8ikJAK8dJxLE-v3HAyY0A'
const base_url = 'https://api.themoviedb.org/3'; 
const get_movies = 'discover/movie';
const api_url = `${base_url}/${get_movies}?api_key=${api_key}`; 
const base_img = 'https://image.tmdb.org/t/p/w500'
const popular_url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
const top_rated_url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200`

// format date and get the current month for use in fetch latest movies 
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
const now = new Date();
const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
const min_date = formatDate(firstDayOfMonth);
const max_date = formatDate(lastDayOfMonth);
// i define the latest movies url here because of the max and min date variable must be defined before calling 
const latest_movies_url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2|3&release_date.gte=${min_date}&release_date.lte=${max_date}`;
// Fetch movies from the main api for display it in hero section 
const fetch_movies = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); 
        print_movies(data.results); 
        updateHeroContent(data.results[0])
    } catch (error) {
        console.error('Fetch error:', error);
    }
}
fetch_movies(api_url);

// Authentication options for API requests
const options = {
    method: 'GET', 
    headers:{
        accept:'application/json',
        authorization:`Bearer ${api_token}`, 
    }
}

const fetch_categories = async (url, section) => {
    if (!section) {
        console.error('Section is undefined');
        return;
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const movies = data.results;

        movies.map((movie) => {
            let htmlStructure;
            console.log(movie);
            
            if (section.classList.contains('popular-movies')) {
                // Structure for Popular Movies
                htmlStructure = `
                    <div class="swiper-slide" style="background-image: url(${base_img}/${movie.poster_path});" id="${movie.id}">
                        <div class="mini-list">
                            <i class="fa fa-list"></i>
                            <ul class="user-list">
                                <li><i class="fa-solid fa-light fa-list"></i><div>Add To list </div></li>
                                <li><i class="fa-solid fa-heart"></i><div>Faviorite </div></li>
                                <li><i class="fa-solid fa-bookmark"></i><div>Watch List </div></li>
                                <li><i class="fa-regular fa-star"></i><div>Your Rate </div></li>
                            </ul>
                        </div>
                        <div class="movie-card">
                            <div class="movie-poster">
                                <img src="${base_img}/${movie.poster_path}">
                            </div>  
                            <div class="movie-info">
                                <p class="movie-title">${movie.title}</p>
                                <div class="release-date">
                                    <p>${movie.release_date}</p>
                                </div>
                                <div class="movie-rate">
                                    <div>IMDB</div>
                                    <div>${movie.vote_average.toFixed(1)} <i class="fa-solid fa-star"></i></div>
                                </div>
                                <div class="movie-genre">${getGenreNames(movie.genre_ids)}</div>
                            </div>
                        </div>
                    </div>`;

            } else if (section.classList.contains('top-rated-movies')) {
                // Structure for Top-Rated Movies
                htmlStructure = `
                <div class="movie-card swiper-slide" id="tomb">
                    <div class="movie-card-image">
                        <img src="${base_img}/${movie.backdrop_path}">
                    </div>
                    <div class="info-section">
                        <div class="movie-header">
                            <div class="movie-header-image">
                                 <img src="${base_img}/${movie.backdrop_path}">
                            </div>
                            <div class = "movie-header-info">
                                <h5>${movie.title}</h5>
                                <h6>${movie.release_date.split("-")[0]}, ${movie.original_language}</h6>
                                <span class="minutes">125 min</span>
                            </div>
                        </div>

                        <p class="genre-type">${getGenreNames(movie.genre_ids)}</p>

                        <div class="movie-desc">
                            <p class="text">
                                ${movie.overview}
                            </p>
                        </div>

                        <div class="movie-social">
                            <ul>
                                <li><i class="fa fa-share"></i></li>
                                <li><i class="fa fa-heart"></i></li>
                                <li><i class="fa fa-bookmark"></i></li>
                            </ul>
                        </div>

                    </div>
                    <div class="lenear-back"></div>
            </div>`;
            } else if (section.classList.contains('latest-trailers')) {
                // Structure for Latest Trailers
                htmlStructure = `
                    <div class="swiper-slide"  id="${movie.id}">
                        
                            <div class="movie-poster"> <img src=${base_img}/${movie.poster_path}></div>

                        <div class="movie-info">
                            <p class="movie-title">${movie.title}</p>
                            <p class="release-date">${movie.release_date}</p>
                        </div>

                           <i class="fa-solid fa-play start" id="start"></i>

                            <div class="mini-list">
                                <i class="fa fa-list"></i>
                               <ul class="user-list">
                                    <li><i class="fa-solid fa-light fa-list"></i><div>Add To list </div></li>
                                    <li><i class="fa-solid fa-heart"></i><div>Faviorite </div></li>
                                    <li><i class="fa-solid fa-bookmark"></i><div>Watch List </div></li>
                                    <li><i class="fa-regular fa-star"></i><div>Your Rate </div></li>
                                </ul>
                            </div>
                    </div>`;
            } else {
                htmlStructure = `
                    <div class="swiper-slide" id="${movie.id}">
                        <div class="movie-card">
                            <div class="movie-poster">
                                <img src="${base_img}/${movie.poster_path}">
                            </div>  
                            <div class="movie-info">
                                <p class="movie-title">${movie.title}</p>
                                <div class="release-date">
                                    <p>${movie.release_date}</p>
                                </div>
                                <div class="movie-rate">
                                    <div>IMDB</div>
                                    <div>${movie.vote_average.toFixed(1)} <i class="fa-solid fa-star"></i></div>
                                </div>
                                <div class="movie-genre">${getGenreNames(movie.genre_ids)}</div>
                            </div>
                        </div>
                    </div>`;
            }

            // Append the generated HTML to the section
            section.innerHTML += htmlStructure;
            
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
    
}

// Usage
const popular_section = document.querySelector('.popular-movies'); 
const top_rated_section = document.querySelector('.top-rated-movies'); 
const latest_trailers_section = document.querySelector('.latest-trailers'); 

fetch_categories(popular_url, popular_section); 
fetch_categories(top_rated_url, top_rated_section); 
fetch_categories(latest_movies_url, latest_trailers_section); // Ensure this is defined




// function for append the movies slides inside the her section slider and inside the content div inside hero section 
function print_movies(movies) {
    const swiper_wrapper = document.querySelector('.swiper-wrapper');
    movies.forEach((movie) => {
        // Create Swiper slide
        const swiper_slide = document.createElement('div');
        swiper_slide.className = 'swiper-slide';
        
        // Create movie image element
        const movie_image = document.createElement('img');
        movie_image.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        movie_image.alt = movie.title;
        
        // Append image to the Swiper slide
        swiper_slide.appendChild(movie_image);
        
        // Attach movie data to the slide (for use in event listener)
        swiper_slide.setAttribute('data-movie', JSON.stringify(movie));
        
        // Add event listener to each slide for click event
        swiper_slide.addEventListener('click', function () {
            const selectedMovie = JSON.parse(this.getAttribute('data-movie'));
            updateHeroContent(selectedMovie); // Update hero section with clicked movie details
        });

        // Append slide to the Swiper wrapper
        swiper_wrapper.appendChild(swiper_slide);
    });
}

// function for Update the hero section with movie details when user click on any movie card slide 
function updateHeroContent(movie) {
    const heroSection = document.querySelector('.hero-section'); 
    const heroContent = document.querySelector('.hero-content');
    const movieTitle = document.querySelector('.movie-title'); 
    const movieInfo = document.querySelector('.movie-details');
    const movieGenre = document.querySelector('.movie-genre'); 
    const movieSummary = heroContent.querySelector('p');
    
    // Update movie info (release date, age rating, runtime, genre)
    movieInfo.innerHTML = `
        <span>${new Date(movie.release_date).getFullYear()}</span>
        <span>${movie.adult ? '18+' : '12+'}</span>
        <span>2h 14min</span> <!-- Use the actual runtime if available -->
    `;
    //update movie title
    movieTitle.textContent = movie.original_title ; 
    //movie genre 
    movieGenre.textContent = getGenreNames(movie.genre_ids);
    // Update movie summary
    movieSummary.textContent = movie.overview;

    //update hero section background
    const backgroundImage = new Image();
    backgroundImage.src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path}`;
    // Once the image is loaded, apply it as the background
    backgroundImage.onload = () => {
        heroSection.style.backgroundImage = `url(${backgroundImage.src})`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
    };
}

// get genre name based on the API construction for determine the movie belong to which category 
function getGenreNames(genre_ids) {
    const genre = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western'
    };
    
    return genre_ids.map(id => genre[id]).join('-');
}






// swiper controls 
var swiper = new Swiper(".carousel .swiper-container", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 1,
      stretch: 0,
      depth: 750,
      modifier: 1,
      slideShadows: true,
    }
  });

   

  
  
  var swiper = new Swiper(".category .swiper-container", {
    slidesPerView: "true",
    slidesPerView: 'auto',
    spaceBetween: 10,
    freeMode: true,
    grabCursor: true,
    on: {
        reachEnd: function () {
            // Disable grabbing when reaching the end
            this.allowTouchMove = false;
        },
        reachBeginning: function () {
            // Re-enable grabbing when at the beginning
            this.allowTouchMove = true;
        },
    },
    
  });






  const menuHeader = document.querySelector('.menu-header'); 
  const menu  = document.querySelector('header ul')
  menuHeader.addEventListener(('click'), ()=>{
    menu.classList.toggle('active');
  })
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !menuHeader.contains(event.target)) {
      menu.classList.remove('active'); 
    }
  });



//   top rated section slide function 