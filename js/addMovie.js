    import { getMovies, getUserMovies, loadPage, updateStats } from "./loadPage.js";
    
    export function openModal() {
        const modal = document.getElementById('add-movie-modal');
        const modalContent = modal.querySelector('.modal-content');
        modal.style.display = 'block';
        setTimeout(() => {
            modalContent.classList.add('active');
            document.getElementById('modalSearchInput').focus();
        }, 10);
    }

    export function closeModal() {
        const modal = document.getElementById('add-movie-modal');
        const modalContent = modal.querySelector('.modal-content');
        modalContent.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    let movieSearchDebounceTimeout;
    export async function searchMoviesForModal(query) {
        clearTimeout(movieSearchDebounceTimeout);
        movieSearchDebounceTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/movies/search?query=${encodeURIComponent(query)}`);
                const data = await response.json();

                modalSearchResults.innerHTML = '';

                if(data.Error){
                    modalSearchResults.innerHTML = '<div class="search-result-item">No movies found</div>';
                    modalSearchResults.classList.add('active');
                    return;
                }

                let movieResults = data;

                movieResults.slice(0, 5).forEach(movie => {
                    console.log(movie)
                    const movieElement = document.createElement('div');
                    movieElement.className = 'search-result-item';
                    movieElement.innerHTML = `
                            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
                                class="search-result-poster"
                                alt="🎬">
                            <div class="search-result-info">
                                <div class="search-result-title">${movie.title}</div>
                                <div class="search-result-year">${movie.release_date.split('-')[0]}</div>
                                <div class="search-result-genres movie-genres" style="max-width: none; margin-bottom: 0;"></div>
                            </div>
                        `;

                    fetch("http://localhost:8080/api/movies/details?id=" + movie.id)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        movieElement.querySelector('.search-result-genres').innerHTML = data.genres.map(genre => `<span class="search-result-genre genre-tag">${genre.name}</span>`).join('');
                    })

                    movieElement.addEventListener('click', async () => {
                        try {

                            const response = await fetch("http://localhost:8080/api/movies/details?id=" + movie.id);
                            const movieDetails = await response.json();

                            const newMovie = {
                                title: movieDetails.title,
                                description: movieDetails.overview,
                                watched: false,
                                year: movieDetails.release_date.split('-')[0],
                                genres: movieDetails.genres.map(g => g.name),
                                posterPath: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                                imdbId: movieDetails.imdb_id,
                                tmdbId: movieDetails.id,
                                streamingServices: [],
                                imdbRating: 0,
                                rtRating: null
                            };

                            const duplicate = getMovies().find(m => m.tmdbId === newMovie.tmdbId);

                            if (duplicate) {
                                const modal = document.getElementById('add-movie-modal');
                                const modalContent = modal.querySelector('.modal-content');
                                modalContent.classList.remove('active');
                                modal.style.display = 'none';

                                window.duplicateMovieToAdd = newMovie;
                                document.getElementById('duplicate-modal').style.display = 'block';
                                // document.getElementById('duplicate-modal').querySelector('.modal-content').style.opacity = '1'
                                setTimeout(() => {
                                    document.getElementById('duplicate-modal').querySelector('.modal-content').classList.add('active');
                                }, 10);
                            } else {
                                await addMovieToWatchlist(newMovie);
                            }

                            modalSearchInput.value = '';
                            modalSearchResults.classList.remove('active');
                        } catch (error) {
                            console.error('Error fetching movie details:', error);
                        }
                    });

                    modalSearchResults.appendChild(movieElement);
                });

                modalSearchResults.classList.add('active');
            } catch (error) {
                console.error('Error searching movies:', error);
            }
        }, 300);
    }

    export async function addMovieToWatchlist(movie) {
        try {
            const response = await fetch('http://localhost:8080/api/movies', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movie)
            });

            if (response.ok) {
                getUserMovies().push(movie);
                updateStats();
                loadPage();
                closeModal(document.getElementById('add-movie-modal'));

                response.json().then(data => {
                    console.log(data)
                    fetch(`http://localhost:8080/api/movies/ratings?imdbId=${movie.imdbId}&id=${data.id}`, {
                        method: "PATCH",
                        credentials: 'include'
                    }).then(response => response.json())
                    .then(data => {
                        if (document.querySelector(`[data-movie-id="${data.id}"]`).querySelector('.imdbRating').querySelector('.rating-loader-spinner')) document.querySelector(`[data-movie-id="${data.id}"]`).querySelector('.imdbRating').querySelector('.rating-loader-spinner').remove();
                        document.querySelector(`[data-movie-id="${data.id}"]`).querySelector('.imdbRating').innerHTML = `<img src="./img/streaming-services/imdb.svg"> ${data.imdbRating}/10`;
                        if (document.querySelector(`[data-movie-id="${data.id}"]`).querySelector('.rtRating').querySelector('.rating-loader-spinner')) document.querySelector(`[data-movie-id="${data.id}"]`).querySelector('.rtRating').querySelector('.rating-loader-spinner').remove();
                        document.querySelector(`[data-movie-id="${data.id}"]`).querySelector('.rtRating').innerHTML = `<img src="./img/streaming-services/rt.png"> ${data.rtRating}`;
                    
                        getMovies().map(m => {
                            if(m.id === data.id){
                                m.imdbRating = data.imdbRating;
                                m.rtRating = data.rtRating;
                            }
                            return m;
                        });
                    });
                });


            } else {
                console.error('Failed to add movie');
            }
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    }

    export function closeDuplicateModal() {
        closeModal(document.getElementById('add-movie-modal'));
        document.getElementById('duplicate-modal').querySelector('.modal-content').classList.remove('active');
        setTimeout(() => {
            document.getElementById('duplicate-modal').style.display = 'none';
        }, 300);
    }

    export function forceAddDuplicate() {
        if (window.duplicateMovieToAdd) {
            addMovieToWatchlist(window.duplicateMovieToAdd);
        }
        closeDuplicateModal();
    }