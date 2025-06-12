    import { searchMovies, updateStats, getMovies, setMovies, getUserMovies, setUserMovies } from "./loadPage.js";

    let movies = [];

    document.addEventListener('click', (event) => {
        if(event.target.id === 'mark-watch-btn') {
            let movieId = event.target.closest('.movie-card').dataset.movieId;
            toggleWatched(movieId);
        }

        if(event.target.id === 'remove-btn') {
            let movieId = event.target.closest('.movie-card').dataset.movieId;
            removeMovie(movieId);
        }

        if (event.target && event.target.parentElement !== null && event.target.parentElement.classList.contains('rating-btn') && !event.target.parentElement.classList.contains('movie-details-rating')) {
            let movieId = event.target.closest('.movie-card').dataset.movieId;
            let rating = event.target.parentElement.dataset.movieRate;
            rateMovie(movieId, parseInt(rating), event.target.parentElement);
        }

        if(event.target.closest('.movie-details-rating')) {
            let movieId = event.target.closest('.modal').dataset.movieId;
            let rating = event.target.dataset.movieRate || event.target.parentElement.dataset.movieRate;
            rateMovie(movieId, parseInt(rating), event.target);
        }

        if(event.target.id === 'watch-movie-btn' || event.target.parentElement !== null && event.target.parentElement.id === 'watch-movie-btn') {
            let movieId = event.target.closest('.movie-card').dataset.movieId;
            watchMovie(movieId);
        }

        if(event.target.className === 'movie-external-ratings' || event.target.parentElement !== null && event.target.parentElement.className === 'movie-external-ratings') {
            let movieId = event.target.closest('.movie-card').dataset.movieId;
            let movieImdbId = event.target.closest('.movie-external-ratings').dataset.movieImdbid;

            document.querySelector(`[data-movie-id="${movieId}"]`).querySelector('.imdbRating').innerHTML = `<img src="./img/streaming-services/imdb.svg"> <div class ='rating-loader-spinner' style='margin-bottom: 0; width: 20px; height: 20px;'></div>`;
            document.querySelector(`[data-movie-id="${movieId}"]`).querySelector('.rtRating').innerHTML = `<img src="./img/streaming-services/rt.png"> <div class ='rating-loader-spinner' style='margin-bottom: 0; width: 20px; height: 20px;'></div>`;

            fetch(`http://localhost:8080/api/movies/ratings?imdbId=${movieImdbId}&id=${movieId}`, {
                method: "PATCH",
                credentials: 'include'
            }).then(response => response.json())
            .then(data => {
                if (document.querySelector(`[data-movie-id="${movieId}"]`).querySelector('.imdbRating').querySelector('.rating-loader-spinner')) document.querySelector(`[data-movie-id="${movieId}"]`).querySelector('.imdbRating').querySelector('.rating-loader-spinner').remove();
                document.querySelector(`[data-movie-id="${movieId}"]`).querySelector('.imdbRating').innerHTML = `<img src="./img/streaming-services/imdb.svg"> ${data.imdbRating}`;
                if (document.querySelector(`[data-movie-id="${movieId}"]`).querySelector('.rtRating').querySelector('.rating-loader-spinner')) document.querySelector(`[data-movie-id="${movieId}"]`).querySelector('.rtRating').querySelector('.rating-loader-spinner').remove();
                document.querySelector(`[data-movie-id="${movieId}"]`).querySelector('.rtRating').innerHTML = `<img src="./img/streaming-services/rt.png"> ${data.rtRating}`;
            
                getMovies().map(m => {
                    if(m.id === data.id){
                        m.imdbRating = data.imdbRating;
                        m.rtRating = data.rtRating;
                    }
                    return m;
                });
            });
        }

        if(event.target.id === 'add-from-user') {
            let movieId = event.target.dataset.movieTmdbid;
            addFromUserToWatchlist(movieId, event);
        }

        if(event.target.closest(".close-modal-btn")) {
            closeMovieDetailsModal();
        }

        const isActionButton = event.target.closest('button');
        if (isActionButton) return; // Don't open details if clicking action buttons

        const card = event.target.closest('.movie-card');
        if (card) {
            const movieId = card.dataset.movieId;
            openMovieDetails(movieId);
        }

    });

    document.addEventListener('dblclick', (event) => {
        if(event.target.id === 'edit-watch-date') {
            let movieId = event.target.closest('.movie-card').dataset.movieId;
            let badgeElement = event.target.closest('.watched-badge');
            editWatchDate(movieId, badgeElement);
        }
    });
    
    export function toggleWatched(id) {
        const movie = getMovies().find(m => m.id === parseInt(id));
        if (movie) {
            movie.watched = !movie.watched;

            fetch(`http://localhost:8080/api/movies/${movie.id}/watch`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).then(response => {
                if (response.ok) {
                    updateStats();
                    searchMovies();
                } else {
                    console.error('Failed to update watch status');
                }
            }).catch(error => {
                console.error('Error updating watch status:', error);
            });
        }
    }

    export function removeMovie(id) {
        let newMovies = getMovies().filter(m => m.id !== parseInt(id));
        setMovies(newMovies);
        
        fetch(`http://localhost:8080/api/movies/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(response => {
            if (response.ok) {
                updateStats();
                searchMovies();
            } else {
                console.error('Failed to delete movie');
            }
        }).catch(error => {
            console.error('Error deleting movie:', error);
        });
    }

    export function rateMovie(movieId, rating, button) {
        if(button.classList.contains('selected') || button.parentElement.classList.contains('selected')){
            rating = -1;
        }

        fetch(`http://localhost:8080/api/movies/${movieId}/rating?rating=${rating}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {

                console.log(button)

                function ratingButtons() {
                    return `
                        ${rating === null || rating === -1 ? `
                            <div class="movie-ratings">
                                <button class="rating-btn ${rating === 0 ? ' selected' : ''}" data-movie-rate="0"><span>👎</span></button>
                                <button class="rating-btn ${rating === 1 ? ' selected' : ''}" data-movie-rate="1"><span>👍</span></button>
                                <button class="rating-btn ${rating === 2 ? ' selected' : ''}" data-movie-rate="2"><span>❤️</span></button>
                            </div>` : ''
                        }
                        ${rating !== null || rating !== -1 ? `
                            <div class="movie-ratings">
                                ${rating === 0 ? `<button class="rating-btn ${rating === 0 ? ' selected' : ''}" data-movie-rate="0"><span>👎</span></button>` : ''}
                                ${rating === 1 ? `<button class="rating-btn ${rating === 1 ? ' selected' : ''}" data-movie-rate="1"><span>👍</span></button>` : ''}
                                ${rating === 2 ? `<button class="rating-btn ${rating === 2 ? ' selected' : ''}" data-movie-rate="2"><span>❤️</span></button>` : ''}
                            </div>` : ''
                        }
                    `
                }

                if(!button.classList.contains('movie-details-rating') && !button.parentElement.classList.contains('movie-details-rating')){
                    button.parentElement.outerHTML = ratingButtons();
                }


                if(button.classList.contains('movie-details-rating') || button.parentElement.classList.contains('movie-details-rating')){
                    if(button.parentElement.classList.contains('movie-details-rating')){
                        button.parentElement.parentElement.querySelectorAll('button').forEach(btn => {
                            btn.classList.remove('selected');
                        });
                    }
                    button.parentElement.querySelectorAll('button').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                } else {
                    let parent = button.parentElement;
                    const buttons = parent.querySelectorAll('button');
                    buttons.forEach(btn => btn.classList.remove('selected'));
                }


                if(button.classList.contains('movie-details-rating') || button.parentElement.classList.contains('movie-details-rating')){
                    document.querySelectorAll('.movie-card').forEach(card => {
                        if(card.dataset.movieId === movieId){
                            card.querySelectorAll('.rating-btn').forEach(btn => {
                                console.log(btn)
                                btn.parentNode.outerHTML = ratingButtons();
                            });
                        }
                    });
                }

                if(rating !== -1){
                    if(button.classList.contains('movie-details-rating') || button.parentElement.classList.contains('movie-details-rating')){
                        if(button.parentElement.classList.contains('movie-details-rating')){
                            button.parentElement.classList.add('selected');
                        } else {
                            button.classList.add('selected');
                        }
                    } else {
                        button.classList.add('selected');
                    }

                    if(button.classList.contains('movie-details-rating') || button.parentElement.classList.contains('movie-details-rating')){
                        document.querySelectorAll('.movie-card').forEach(card => {
                            if(card.dataset.movieId === movieId){
                                card.querySelectorAll('.rating-btn').forEach(btn => {
                                    if(parseInt(btn.dataset.movieRate) === parseInt(rating)){
                                        btn.classList.add('selected');
                                    }
                                });
                            }
                        });
                    }
                }

                getMovies().find(m => m.id === parseInt(movieId)).rating = rating;
            } else {
                console.error('Failed to update watch status');
            }
        })
        .catch(err =>  {
            console.error('Rating failed', err)   
        });
    }

    function editWatchDate(movieId, badgeElement) {
        const movie = getMovies().find(m => m.id === parseInt(movieId));
        console.log(movie)
        if (!movie) return;


        const currentDate = movie.watchDate ? new Date(movie.watchDate) : new Date();
        const dateString = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Create date input
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'date-input';
        dateInput.value = dateString;
        dateInput.locale = 'en-GB';

        // Replace badge content with input
        const originalContent = badgeElement.innerHTML;
        badgeElement.innerHTML = '';
        badgeElement.appendChild(dateInput);

        // Focus and select the input
        dateInput.focus();

        // Handle save on Enter or blur
        const saveDate = () => {
            const newDate = dateInput.value;
            if (newDate) {
                movie.watchDate = new Date(newDate).getTime();

                // Send API request to update watch date
                fetch(`http://localhost:8080/api/movies/${movieId}/watch-date?watchDate=${new Date(newDate).getTime()}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            console.error('Failed to update watch date');
                            // Revert on error
                            badgeElement.innerHTML = originalContent;
                            return;
                        }

                        // Update badge with new date
                        const formattedDate = new Date(movie.watchDate).toLocaleDateString('en-GB');
                        badgeElement.innerHTML = `✓ Watched on ${formattedDate}`;
                    })
                    .catch(error => {
                        console.error('Error updating watch date:', error);
                        // Revert on error
                        badgeElement.innerHTML = originalContent;
                    });
            } else {
                // Revert if no date selected
                badgeElement.innerHTML = originalContent;
            }
        };

        // Handle cancel on Escape
        const cancelEdit = () => {
            badgeElement.innerHTML = originalContent;
        };

        dateInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveDate();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            }
        });

        dateInput.addEventListener('blur', saveDate);

        // Prevent event bubbling to avoid triggering other handlers
        dateInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    let streamingIcons = {
        "disney": "../img/streaming-services/disney.png",
        "netflix": "../img/streaming-services/netflix.png",
        "prime": "../img/streaming-services/prime.png",
        "apple": "../img/streaming-services/apple.png",
        "paramount": "../img/streaming-services/paramount.png"
    }

    function watchMovie(id) {
        const movie = getMovies().find(m => m.id === parseInt(id));
        if (!movie) return;

        const popup = document.getElementById('streaming-popup');
        popup.innerHTML = '';

        fetch(`http://localhost:8080/api/movies/streaming-availability?id=${movie.tmdbId}`)
            .then(response => response.json())
            .then(data => {
                const entries = data.DE || [];

                if (entries.length === 0) {
                    popup.innerHTML += '<div>No streaming services listed</div>';
                    return;
                }

                let section = document.createElement('div');
                section.style.cursor = 'pointer';
                section.style.marginBottom = '15px';
                section.onmouseover = () => section.style.opacity = '0.8';
                section.onmouseout = () => section.style.opacity = '1';
                section.onclick = () => open(entries.link);
                popup.appendChild(section);

                console.log(entries)

                if(entries.flatrate && entries.flatrate.length > 0 && entries.flatrate[0].display_priority < 21){
                    let type = document.createElement('div');
                    type.textContent = 'Stream';
                    type.style.fontWeight = 'bold';
                    type.style.marginBottom = '5px';
                    section.appendChild(type);

                    let entryIndex = 0;
                    entries.flatrate.forEach(entry => {
                        if(entry.display_priority > 20 || entryIndex > 2) {
                            return;
                        }

                        let service = document.createElement('a');
                        service.style.display = 'flex';
                        service.style.alignItems = 'center';
                        service.style.marginBottom = '0.4rem';
                        service.style.textDecoration = 'none';
                        service.style.color = 'white';
                        service.style.fontWeight = '600';
                        service.style.gap = '10px';

                        const icon = document.createElement('img');
                        icon.src = `https://image.tmdb.org/t/p/w500/${entry.logo_path}` || '';
                        icon.alt = entry.service;
                        icon.style.width = '30px';
                        icon.style.height = '30px';
                        icon.style.borderRadius = '4px';

                        const label = document.createElement('span');
                        label.textContent = entry.provider_name;
                                    
                        service.appendChild(icon);
                        service.appendChild(label);
                        section.appendChild(service);
                    });
                }

                if(entries.buy.length > 0 && entries.buy[0].display_priority < 21){
                    let type = document.createElement('div');
                    type.textContent = 'Buy / Rent';
                    type.style.fontWeight = 'bold';
                    type.style.marginBottom = '5px';
                    section.appendChild(type);

                    let entryIndex = 0;
                    entries.buy.forEach(entry => {
                        if(entry.display_priority > 20 || entryIndex > 2) {
                            return;
                        }

                        entryIndex++;
                        
                        let service = document.createElement('a');
                        service.style.display = 'flex';
                        service.style.alignItems = 'center';
                        service.style.marginBottom = '0.4rem';
                        service.style.textDecoration = 'none';
                        service.style.color = 'white';
                        service.style.fontWeight = '600';
                        service.style.gap = '10px';

                        const icon = document.createElement('img');
                        icon.src = `https://image.tmdb.org/t/p/w500/${entry.logo_path}` || '';
                        icon.alt = entry.service;
                        icon.style.width = '30px';
                        icon.style.height = '30px';
                        icon.style.borderRadius = '4px';

                        const label = document.createElement('span');
                        label.textContent = entry.provider_name;
                                    
                        service.appendChild(icon);
                        service.appendChild(label);
                        section.appendChild(service);
                    });
                }

                let credit = document.createElement('a');
                credit.textContent = "Source:";
                credit.innerHTML = `Source: <img src="https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg" style="width: 70px; margin-left: 10px; margin-bottom: 4px;"><br>`;
                credit.href = "https://www.justwatch.com/"
                credit.target = "_blank";
                credit.style.color = 'white';
                credit.style.textDecoration = 'none';
                credit.style.fontSize = '13px';
                popup.appendChild(credit);

                let credit2 = document.createElement('a');
                credit2.textContent = "Provided by:";
                credit2.innerHTML = `Provided by: <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" style="width: 70px; margin-left: 10px; margin-bottom: 4px;">`;
                credit2.href = "https://www.themoviedb.org"
                credit2.target = "_blank";
                credit2.style.color = 'white';
                credit2.style.textDecoration = 'none';
                credit2.style.fontSize = '13px';
                popup.appendChild(credit2);
            });

            console.log(event.clientX)

        const button = event.target.closest('button');

        const rect = button.getBoundingClientRect();

        popup.style.left = `${rect.right + 10 + window.scrollX}px`;
        popup.style.top = `${rect.top + window.scrollY}px`;
        popup.style.display = 'block';
    }

    async function addFromUserToWatchlist(movie, event) {
        const response = await fetch("http://localhost:8080/api/movies/details?id=" + movie);
        const movieDetails = await response.json();

        console.log(movieDetails)

        const newMovie = {
            title: movieDetails.title,
            description: movieDetails.overview,
            watched: false,
            year: movieDetails.release_date.split('-')[0],
            genres: movieDetails.genres.map(g => g.name),
            posterPath: `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`,
            imdbId: movieDetails.imdb_id,
            tmdbId: movieDetails.id,
            streamingServices: [],
            imdbRating: 0,
            rtRating: null
        };

        const duplicate = getUserMovies().find(m => m.tmdbId === newMovie.tmdbId);

        if (duplicate) {
            window.duplicateMovieToAdd = newMovie;
            document.getElementById('duplicate-modal').style.display = 'block';
            // document.getElementById('duplicate-modal').querySelector('.modal-content').style.opacity = '1'
            setTimeout(() => {
                document.getElementById('duplicate-modal').querySelector('.modal-content').classList.add('active');
                console.log('asd')
            }, 10);
        } else {
            event.target.disabled = true;
            event.target.textContent = "Added to Watchlist";
            
            try {
                const response = await fetch('http://localhost:8080/api/movies', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newMovie)
                });

                if (response.ok) {
                    console.log('Movie added to watchlist')
                } else {
                    console.error('Failed to add movie');
                }
            } catch (error) {
                console.error('Error adding movie:', error);
            }
        }
    }

    function openMovieDetails(movieId) {
        const movie = movies.find(m => m.id === parseInt(movieId)) || getMovies().find(m => m.id === parseInt(movieId));
        if (!movie) return;

        const modal = document.getElementById('movie-details-modal');
        modal.dataset.movieId = movieId;
        const modalContent = modal.querySelector('.movie-details-content');

        // Update modal content
        document.getElementById('modal-movie-poster').src = movie.posterPath;
        document.getElementById('modal-movie-poster').alt = movie.title;
        document.getElementById('modal-movie-title').textContent = movie.title;
        document.getElementById('modal-movie-year').textContent = movie.year;
        document.getElementById('modal-movie-genres').innerHTML = movie.genres.map(genre => 
            `<span class="genre-tag">${genre}</span>`
        ).join('');
        document.getElementById('modal-movie-description').textContent = movie.description;
        document.getElementById('modal-movie-external-ratings').innerHTML = `
            <h3>Ratings</h3>
            <table class="ratings-table">
                <tr id="imdb-rating">
                    <td><img src="./img/streaming-services/imdb.svg" alt="IMDb" class="icon"></td>
                    <td>IMDb</td>
                    <td class="rating-loader-spinner"></td>
                </tr>
                <tr id="rt-rating">
                    <td><img src="./img/streaming-services/rt.png" alt="Rotten Tomatoes" class="icon"></td>
                    <td>Rotten Tomatoes</td>
                    <td class="rating-loader-spinner"></td>
                </tr>
            </table>
        `;

        fetch(`http://localhost:8080/api/movies/ratings?id=${movie.imdbId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const imdbRating = document.getElementById('imdb-rating');
                imdbRating.appendChild(document.createTextNode(`${data.imdbRating}/10`));
                document.querySelector('.rating-loader-spinner').remove();

                const rtRating = document.getElementById('rt-rating');
                rtRating.appendChild(document.createTextNode(data.rtRating));
                document.querySelector('.rating-loader-spinner').remove();
            })

        // Update ratings
        const ratingsContainer = document.getElementById('modal-movie-ratings');
        ratingsContainer.innerHTML = `
            <button class="rating-btn movie-details-rating ${movie.rating === 0 ? ' selected' : ''}" data-movie-rate=0><span>👎 Did not like it</span></button>
            <button class="rating-btn movie-details-rating ${movie.rating === 1 ? ' selected' : ''}" data-movie-rate=1><span>👍 Liked it</span></button>
            <button class="rating-btn movie-details-rating ${movie.rating === 2 ? ' selected' : ''}" data-movie-rate=2><span>❤️ Loved it</span></button>
        `;

        // Fetch and display streaming services
        fetch(`http://localhost:8080/api/movies/streaming-availability?id=${movie.tmdbId}`)
            .then(response => response.json())
            .then(data => {
                const streamingServicesContainer = document.getElementById('modal-streaming-services');
                streamingServicesContainer.innerHTML = '';

                if (!data || !data.DE) {
                    streamingServicesContainer.innerHTML = '<div class="no-streaming">No streaming services available</div>';
                    return;
                }

                const entries = data.DE;
                let hasContent = false;

                // Handle flatrate (streaming) services
                if (entries.flatrate && entries.flatrate.length > 0 || entries.buy && entries.buy.length > 0 || entries.rent && entries.rent.length > 0) {
                    hasContent = true;
                    const streamSection = document.createElement('div');
                    streamSection.className = 'streaming-section';
                    
                    const streamTitle = document.createElement('h3');
                    streamTitle.textContent = 'Available on';
                    streamTitle.className = 'streaming-section-title';
                    streamSection.appendChild(streamTitle);

                    const streamGrid = document.createElement('div');
                    streamGrid.className = 'streaming-grid';
                    
                    // Combine all services
                    const allServices = [];
                    if (entries.flatrate) {
                        allServices.push(...entries.flatrate.map(service => ({ ...service, type: 'stream' })));
                    }
                    if (entries.buy) {
                        allServices.push(...entries.buy.map(service => ({ ...service, type: 'buy' })));
                    }
                    if (entries.rent) {
                        allServices.push(...entries.rent.map(service => ({ ...service, type: 'rent' })));
                    }

                    // Show only first 5 services
                    const servicesToShow = allServices.slice(0, 5);
                    const remainingCount = allServices.length - 5;

                    // Create a wrapper link for the entire grid
                    const gridLink = document.createElement('a');
                    gridLink.href = entries.link;
                    gridLink.target = '_blank';
                    gridLink.className = 'streaming-grid-link';

                    servicesToShow.forEach(service => {
                        const serviceItem = document.createElement('div');
                        serviceItem.className = 'streaming-service-item';
                        serviceItem.title = `${service.provider_name} (${service.type === 'stream' ? 'Stream' : 'Buy/Rent'})`;

                        const logo = document.createElement('img');
                        logo.src = `https://image.tmdb.org/t/p/original${service.logo_path}`;
                        logo.alt = service.provider_name;
                        serviceItem.appendChild(logo);
                        gridLink.appendChild(serviceItem);
                    });

                    // Add "& more" if there are more services
                    if (remainingCount > 0) {
                        const moreItem = document.createElement('div');
                        moreItem.className = 'streaming-service-item more-item';
                        moreItem.innerHTML = `<span>+${remainingCount}</span>`;
                        gridLink.appendChild(moreItem);
                    }

                    streamGrid.appendChild(gridLink);
                    streamSection.appendChild(streamGrid);
                    streamingServicesContainer.appendChild(streamSection);

                    const source = document.createElement('a');
                    source.style.display = 'flex';
                    source.style.justifyContent = 'end';
                    source.innerHTML = `<img src="https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg" style="width: 80px;">`;
                    source.href = 'https://www.justwatch.com/';
                    source.target = '_blank';
                    source.alt = 'JustWatch';
                    streamSection.appendChild(source);
                } else {
                    const noStreaming = document.createElement('div');
                    noStreaming.className = 'no-streaming';
                    noStreaming.textContent = 'No streaming services available';
                    streamingServicesContainer.appendChild(noStreaming);
                }
            })
            .catch(error => {
                console.error('Error fetching streaming services:', error);
                const errorMessage = document.createElement('div');
                errorMessage.className = 'streaming-error';
                errorMessage.textContent = 'Error loading streaming services';
                streamingServicesContainer.appendChild(errorMessage);
            });

        // Show modal with transition
        modal.style.display = 'block';
        // Trigger reflow
        modal.offsetHeight;
        modalContent.classList.add('active');
    }

    export function closeMovieDetailsModal() {
        const modal = document.getElementById('movie-details-modal');
        const modalContent = modal.querySelector('.movie-details-content');
        
        modalContent.classList.remove('active');
        
        // Wait for the transition to complete before hiding the modal
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }