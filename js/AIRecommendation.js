    export async function getAIRecommendation() {

        if(document.querySelector('.movie-cards-container')){
            document.querySelectorAll('.movie-cards-container').forEach(container => container.remove());
        }

        const loader = document.getElementById('ai-loader');
        loader.style.display = 'flex';

        let watchedMovies = currentUserMovies.filter(m => m.watched);
        let toWatchMovies = currentUserMovies.filter(m => !m.watched);

        console.log(watchedMovies.map(m => m.title).join('\n'))
        console.log(toWatchMovies.map(m => m.title).join('\n'))

        try {
            const response = await fetch('http://localhost:8080/api/movies/recommendations', {
                method: 'GET',
                credentials: 'include'
            });
            let data = await response.json();

            let movies = [];
            
            let movie1 = JSON.parse(data[0])
            let movie2 = JSON.parse(data[1])
            let movie3 = JSON.parse(data[2])
            movies.push(movie1)
            movies.push(movie2)
            movies.push(movie3)
    
            let movieCardContainer = document.createElement('div');
            movieCardContainer.className = "movie-cards-container";
            movieCardContainer.style.display = 'flex';
            movieCardContainer.style.justifyContent = 'center';
            movieCardContainer.style.flexWrap = 'wrap';
            movieCardContainer.style.gap = '1rem';
            movieCardContainer.style.marginTop = '1rem';
    
            document.querySelector('#add-movie-modal > div').appendChild(movieCardContainer);
        
            for(let i = 0; i < movies.length; i++) {
                console.log(movies[i])
    
                if(movies[i].Search[0]){
                    let movieCard = document.createElement('div');
                    movieCard.style.padding = '0.5rem'
                    movieCard.style.width = '165px'
                    movieCard.style.height = '200px'
                    movieCard.style.cursor = 'pointer'
                    movieCard.className = 'movie-card';
                    movieCard.addEventListener('click', () => addMovieToWatchlistAI(movies[i].Search[0].imdbID));
            
                    let movieHeader = document.createElement('div');
                    movieHeader.className = 'movie-header';
            
                    let moviePoster = document.createElement('div');
                    moviePoster.className = 'movie-poster';
                    moviePoster.style.width = '60px'
                    moviePoster.style.height = '70px'
            
                    moviePoster.innerHTML = `<img src="${movies[i].Search[0].Poster}">`;
            
                    let movieInfo = document.createElement('div');
                    movieInfo.className = 'movie-info';
            
                    let movieTitle = document.createElement('div');
                    movieTitle.className = 'movie-title';
                    movieTitle.style.fontSize = "0.9rem"
                    movieTitle.style.marginTop = "0px"
                    movieTitle.style.marginBottom = "0px"
                    movieTitle.style.lineHeight = "18px"
                    movieTitle.style.marginBottom = "5px"
                    movieTitle.textContent = movies[i].Search[0].Title;
            
                    let movieYear = document.createElement('div');
                    movieYear.className = 'movie-year';
                    movieYear.style.fontSize = "0.8rem"
                    movieYear.textContent = movies[i].Search[0].Year;
            
                    let movieDescription = document.createElement('div');
                    movieDescription.className = 'movie-description';
                    movieDescription.style.fontSize = "0.8rem"
                    movieDescription.style.marginTop = "-16px"
                    movieDescription.textContent = "movies[i].results[0].overview";
            
                    // let movieGenres = document.createElement('div');
                    // movieGenres.className = 'movie-genres';
                    // data.results[0].genres.forEach(genre => {
                    //     let genreTag = document.createElement('span');
                    //     genreTag.className = 'genre-tag';
                    //     genreTag.textContent = genre;
                    //     movieGenres.appendChild(genreTag);
                    // });
            
                    movieInfo.appendChild(movieTitle);
                    movieInfo.appendChild(movieYear);
                    //movieInfo.appendChild(movieGenres);
            
                    movieHeader.appendChild(moviePoster);
                    movieHeader.appendChild(movieInfo);
            
                    movieCard.appendChild(movieHeader);
                    movieCard.appendChild(movieDescription);
            
                    movieCardContainer.appendChild(movieCard);


                    async function addMovieToWatchlistAI(movieId){
                        try {
                            const response = await fetch("http://localhost:8080/api/movies/details?id=" + movieId);
                            const movieDetails = await response.json();

                            const newMovie = {
                                title: movieDetails.Title,
                                description: movieDetails.Plot,
                                watched: false,
                                year: movieDetails.Year,
                                genres: movieDetails.Genre.split(',').map(g => g.trim()),
                                posterPath: movieDetails.Poster,
                                imdbId: movieDetails.imdbID,
                                streamingServices: [],
                                imdbRating: movieDetails.imdbRating,
                                rtRating: movieDetails.Ratings.find(r => r.Source === 'Rotten Tomatoes') ? movieDetails.Ratings.find(r => r.Source === 'Rotten Tomatoes').Value : null
                            };

                            const duplicate = movies.find(m => m.imdbId === newMovie.imdbId);

                            if (duplicate) {
                                window.duplicateMovieToAdd = newMovie;
                                document.getElementById('duplicate-modal').style.display = 'block';
                            } else {
                                await addMovieToWatchlist(newMovie);
                            }

                            modalSearchInput.value = '';
                            modalSearchResults.classList.remove('active');
                        } catch (error) {
                            console.error('Error fetching movie details:', error);
                        }
                    }

                }
            }
        } catch (error) {
            console.error('Error fetching AI recommendations:', error);
        } finally {
            loader.style.display = 'none';
        }

    }