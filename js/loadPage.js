import { openLoginModal } from "./auth.js";

    let movies = [];
    let loggedIn = false;
    let username;
    let currentUserMovies = [];
    let path = window.location.pathname;
    let currentFilter = 'all';

    export function getMovies() {
        return movies;
    }

    export function setMovies(newMovies) {
        movies = newMovies;
    }

    export function getUserMovies() {
        return currentUserMovies;
    }

    export function setUserMovies(newMovies) {
        currentUserMovies = newMovies;
    }

    export function getFilter() {
        return currentFilter;
    }

    export function setFilter(newFilter) {
        currentFilter = newFilter;
    }

    export function getUser() {
        return username;
    }

    export function setUser(newUser) {
        username = newUser;
    }
    
    fetch(`http://localhost:8080/api/user`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(async response => {
            if (!response.ok) {
                if(response.status === 401){
                    loggedIn = false;
                    loadPage();
                    return;
                }
            }
            
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                loggedIn = false;
                loadPage();
                return;
            }
        })
        .then(data => {
            if(data){
                loggedIn = true;
                setUser(data.username);
                loadPage()
    
                fetch(`http://localhost:8080/api/page`, {
                    method: 'GET',
                    credentials: 'include'
                }).then(response => response.json())
                .then(data => {
                    currentUserMovies = data.movies || [];
                })
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });

    function myProfile(){
        if(!path.split('/')[1] || path.split('/')[1] === getUser()){
            return true;
        } else {
            return false;
        }
    }


    export function loadPage() {

        console.log(loggedIn)

        if(!loggedIn && !path.split('/')[1]){
            renderMovies()
            return;
        }

        let url = path && path.split('/')[1] ? `http://localhost:8080/api/page/${path.split('/')[1]}` : `http://localhost:8080/api/page`;

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
        .then(async response => {
            if (!response.ok) {
                if(response.status === 404){
                    return userNotFound();
                } else if(response.status === 403){
                    return pageNotPublic();
                }
                
                const error = await response.json();
                throw new Error(error.message);
            }
            return response.json();
        })
        .then(data => {
            if(data){
                movies = data.movies || [];
                renderMovies();
                updateStats();
                updateLoginButton();
                document.getElementById('watchlist-title').textContent = `${myProfile() === false ? `${data.ownerName}'s` : "My"} Watchlist`;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error.message);
        });

        if(!myProfile()){
            document.querySelector('.add-btn').style.display = 'none';
        
        } else {
            document.querySelector('.add-btn').style.display = '';
        }
    }

    export function renderMovies(moviesToRender = movies, error, username) {
        console.log(moviesToRender)
        const grid = document.getElementById('movies-grid');

        if(error === "notFound" && username){
            grid.innerHTML = `<div style="text-align: center; color: #b8b8d1; grid-column: 1/-1; padding: 2rem;">User <strong>${username}</strong> not found.</div>`;
            return;
        } else if(error === "notPublic" && username){
            grid.innerHTML = `<div style="text-align: center; color: #b8b8d1; grid-column: 1/-1; padding: 2rem;">User <strong>${username}</strong> has not made their page public.</div>`;
            return;
        }

        if(!loggedIn && !path.split('/')[1]){
            grid.innerHTML = '<div style="text-align: center; color: #b8b8d1; grid-column: 1/-1; padding: 2rem;">Log in to view your movies.</div><br><div class="load-login-btn"><button id="load-login-btn" class="login-btn">Login</button></div>';
            
            const loadLoginModalBtn = document.getElementById("load-login-btn");
            loadLoginModalBtn.addEventListener("click", openLoginModal);
            return;
        }

        if (moviesToRender.length === 0) {
            grid.innerHTML = '<div style="text-align: center; color: #b8b8d1; grid-column: 1/-1; padding: 2rem;">No movies found matching your criteria.</div>';
            return;
        }

        grid.innerHTML = moviesToRender.map(movie => `
                <div class="movie-card ${movie.watched ? 'watched' : ''}" id="movie-card" data-movie-id="${movie.id}">
                    ${movie.watched ? `<div class="watched-badge" id="edit-watch-date">✓ Watched on ${movie.watchDate ? new Date(movie.watchDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</div>` : ''}                    <div class="movie-header">
                        <div class="movie-poster">
                            <img src="${movie.posterPath}" alt="${movie.title}">
                        </div>
                        <div class="movie-info">
                            <div class="movie-title" title="${movie.title}">${movie.title}</div>
                            <div class="movie-year">${movie.year}</div>
                            <div class="movie-genres">
                                ${movie.genres.map(genre => `<span class="genre-tag" title="${genre}">${genre}</span>`).join('')}
                            </div>
                            <button class="movie-external-ratings" data-movie-imdbid="${movie.imdbId}">
                                <span class="imdbRating"><img src="./img/streaming-services/imdb.svg"> ${movie.imdbRating === 0 ? "<div class ='rating-loader-spinner' style='margin-bottom: 0; width: 20px; height: 20px;'></div>" : movie.imdbRating}/10</span>
                                <span class="rtRating"><img src="./img/streaming-services/rt.png"> ${movie.rtRating === null ? "<div class ='rating-loader-spinner' style='margin-bottom: 0; width: 20px; height: 20px;'></div>" : movie.rtRating}</span>
                            </button>
                            <div class="movie-streaming-service">
                                <button id="watch-movie-btn" class="movie-watch watch-btn action-btn"><span>🎬</span><p>Watch</p></button>
                            </div>
                            ${movie.watched === true && movie.rating === null || movie.watched === true && movie.rating === -1 ? `
                                <div class="movie-ratings">
                                    <button class="rating-btn ${movie.rating === 0 ? ' selected' : ''}" data-movie-rate="0"><span>👎</span></button>
                                    <button class="rating-btn ${movie.rating === 1 ? ' selected' : ''}" data-movie-rate="1"><span>👍</span></button>
                                    <button class="rating-btn ${movie.rating === 2 ? ' selected' : ''}" data-movie-rate="2"><span>❤️</span></button>
                                </div>` : ''
                            }
                            ${movie.watched === true && movie.rating !== null || movie.watched === true && movie.rating !== -1 ? `
                                <div class="movie-ratings">
                                    ${movie.rating === 0 ? `<button class="rating-btn ${movie.rating === 0 ? ' selected' : ''}" data-movie-rate="0"><span>👎</span></button>` : ''}
                                    ${movie.rating === 1 ? `<button class="rating-btn ${movie.rating === 1 ? ' selected' : ''}" data-movie-rate="1"><span>👍</span></button>` : ''}
                                    ${movie.rating === 2 ? `<button class="rating-btn ${movie.rating === 2 ? ' selected' : ''}" data-movie-rate="2"><span>❤️</span></button>` : ''}
                                </div>` : ''
                            }
                        </div>
                    </div>
                    <div class="movie-description">${movie.description}</div>
                    <div class="movie-actions">
                        ${ myProfile() === true ? `<button class="action-btn watch-btn" id="mark-watch-btn">
                            ${movie.watched ? 'Mark Unwatched' : 'Mark Watched'}` : ''}
                        </button>
                        ${myProfile() === true ? `<button id="remove-btn" class="action-btn remove-btn">Remove</button>` : ''}
                        ${myProfile() === false && getUser() ? `<button id="add-from-user" class="action-btn watch-btn addtowatch-btn" data-movie-tmdbId="${movie.tmdbId}">Add to Watchlist</button>` : ''}
                    </div>
                </div>
            `).join('');

            if(document.querySelector(`[data-movie-id="${window.movieId}"]`) && window.movieId !== null){
                document.querySelector(`[data-movie-id="${window.movieId}"]`).querySelector('#add-from-user').disabled = true;
                window.movieId = null;
            }

            if(!myProfile()){
                document.querySelectorAll('.rating-btn').forEach(btn => btn.disabled = true);
            }

    }


    export function updateStats() {
        const total = movies.length;
        const watched = movies.filter(m => m.watched).length;
        const toWatch = total - watched;

        document.getElementById('total-movies').textContent = total;
        document.getElementById('watched-count').textContent = watched;
        document.getElementById('to-watch-count').textContent = toWatch;
    }

    function updateLoginButton() {
        const loginBtn = document.querySelector('.login-btn');
        const profileContainer = document.querySelector('.profile-container');
        
        if (loggedIn) {
            loginBtn.style.display = 'none';
            profileContainer.style.display = 'block';
            
            // Update profile picture
            const profilePic = document.querySelector('.profile-pic');
            const imgPath = `/img/user/${getUser()}.png`;
            
            // Try to load custom profile picture
            const tempImg = new Image();
            tempImg.onload = function() {
                profilePic.src = imgPath;
            };
            tempImg.onerror = function() {
                // If image not found, create an SVG with the first letter
                const firstLetter = getUser().charAt(0).toUpperCase();
                profilePic.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="%234ecdc4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">${firstLetter}</text></svg>`;
            };
            tempImg.src = imgPath;
        } else {
            loginBtn.style.display = 'block';
            profileContainer.style.display = 'none';
        }
    }

    function userNotFound() {
        movies = [];
        document.querySelector('.controls').style.display = 'none'
        document.querySelector('.search-container').style.display = 'none'
        document.querySelector('.filter-tabs').style.display = 'none'
        document.querySelector('.stats').style.display = 'none'
        renderMovies(null, "notFound", path.split('/')[1]);
    }

    function pageNotPublic() {
        movies = [];
        document.querySelector('.controls').style.display = 'none'
        document.querySelector('.search-container').style.display = 'none'
        document.querySelector('.filter-tabs').style.display = 'none'
        document.querySelector('.stats').style.display = 'none'
        document.querySelector('#watchlist-title').style.display = 'none'
        renderMovies(null, "notPublic", path.split('/')[1]);
    }

    export function searchMovies() {
        console.log('asd')
        console.log(movies)
        const query = document.getElementById('search-input').value.toLowerCase();
        let filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(query) 
            // ||
            // movie.genres.some(genre => genre.toLowerCase().includes(query)) ||
            // movie.description.toLowerCase().includes(query)
        );

        if (getFilter() === 'watched') {
            filteredMovies = filteredMovies.filter(m => m.watched);
        } else if (getFilter() === 'to-watch') {
            filteredMovies = filteredMovies.filter(m => !m.watched);
        }

        renderMovies(filteredMovies);
    }

    export function filterMovies(filter) {
        setFilter(filter);

        document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');

        let filteredMovies;
        switch (filter) {
            case 'watched':
                filteredMovies = movies.filter(m => m.watched);
                break;
            case 'to-watch':
                filteredMovies = movies.filter(m => !m.watched);
                break;
            default:
                filteredMovies = movies;
        }

        renderMovies(filteredMovies);
    }