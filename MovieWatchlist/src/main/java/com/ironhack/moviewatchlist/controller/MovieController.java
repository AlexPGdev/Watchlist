package com.ironhack.moviewatchlist.controller;

import com.ironhack.moviewatchlist.dto.RatingResponse;
import com.ironhack.moviewatchlist.exceptions.NotLoggedInException;
import com.ironhack.moviewatchlist.exceptions.PageNotFoundException;
import com.ironhack.moviewatchlist.model.Movie;
import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.MovieRepository;
import com.ironhack.moviewatchlist.repository.PageRepository;
import com.ironhack.moviewatchlist.repository.UserRepository;
import com.ironhack.moviewatchlist.service.APIServices;
import com.ironhack.moviewatchlist.service.MovieService;
import com.ironhack.moviewatchlist.service.PageService;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.core.video.Video;
import info.movito.themoviedbapi.model.core.watchproviders.WatchProviders;
import info.movito.themoviedbapi.model.movies.Cast;
import info.movito.themoviedbapi.model.movies.Credits;
import info.movito.themoviedbapi.model.movies.MovieDb;
import info.movito.themoviedbapi.tools.TmdbException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;
    private final UserRepository userRepository;
    private final PageService pageService;
    private final MovieRepository movieRepository;
    private final APIServices apiServices;
    private final PageRepository pageRepository;

    public MovieController(MovieService movieService, UserRepository userRepository, PageService pageService, MovieRepository movieRepository, APIServices apiServices, PageRepository pageRepository) {
        this.movieService = movieService;
        this.userRepository = userRepository;
        this.pageService = pageService;
        this.movieRepository = movieRepository;
        this.apiServices = apiServices;
        this.pageRepository = pageRepository;
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/search")
    public List<info.movito.themoviedbapi.model.core.Movie> searchMovies(@RequestParam String query) throws TmdbException {
        return apiServices.searchMovies(query);
    }

    @GetMapping("/details")
    public MovieDb getMovieDetails(@RequestParam int id) throws TmdbException {
        return apiServices.getMovieDetails(id);
    }

    @GetMapping("/trailer")
    public Optional<Video> getMovieTrailer(@RequestParam int tmdbId) throws TmdbException {
        return apiServices.getMovieTrailer(tmdbId);
    }

    @GetMapping("/streaming-availability")
    public Map<String, WatchProviders> getStreamingAvailability(@RequestParam Integer id) throws TmdbException {
        return apiServices.getStreamingAvailability(id);
    }

    @GetMapping("/alsowatch")
    public MovieResultsPage getAlsoWatch(@RequestParam int id) throws TmdbException {
        return apiServices.getAlsoWatch(id);
    }

    @GetMapping("/cast")
    public List<Cast> getCast(@RequestParam int id) throws TmdbException {
        return apiServices.getCast(id);
    }

    @GetMapping("/ratings")
    public RatingResponse getMovieRatings(@RequestParam String id) throws IOException {
        return apiServices.getMovieRatings(id);
    }

    @GetMapping("/recommendations")
    public Mono<List<info.movito.themoviedbapi.model.core.Movie>> getRecommendations(Authentication authentication) throws TmdbException, IOException {
        User currentUser = userRepository.findByUsername(authentication.getName());
        return movieService.getRecommendations(currentUser);
    }

    @PostMapping
    public Movie createMovie(@RequestBody Movie movie, Authentication authentication) throws TmdbException {
        User currentUser = userRepository.findByUsername(authentication.getName());

        Page page = pageService.getUserPage(currentUser);
        if(page == null) {
            pageService.createPage("Movie Watchlist", "My watchlist", true, currentUser);
            page = pageService.getUserPage(currentUser);
        }

        movie.setPage(page);
        movieService.createMovie(movie, currentUser);
        pageService.addMovieToPage(page.getId(), movie, currentUser);
        return movie;
    }

    @PostMapping("/{id}/streaming-service")
    public Movie addStreamingService(@PathVariable Long id, @RequestBody String streamingService) {
        return movieService.addStreamingService(id, streamingService);
    }

    @PatchMapping("/{id}/watch")
    public Movie updateMovieWatchStatus(@PathVariable Long id, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageService.getUserPage(currentUser);
        Movie movie = page.getMovies().stream().filter(m -> m.getId().equals(id)).findFirst().orElse(null);
        if(movie == null) {
            throw new PageNotFoundException("Movie not found in your library");
        }
        return movieService.updateMovieWatchStatus(movie.getId(), currentUser);
    }

    @PatchMapping("/{id}/rating")
    public Movie updateMovieRating(@PathVariable Long id, @RequestParam(name = "rating") Integer rating, Authentication authentication) {
        if(authentication == null) {
            throw new NotLoggedInException("Not logged in");
        }
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageService.getUserPage(currentUser);
        Movie movie = page.getMovies().stream().filter(m -> m.getId().equals(id)).findFirst().orElse(null);
        if(movie == null) {
            throw new PageNotFoundException("Movie not found in your library");
        }
        return movieService.updateMovieRating(id, rating);
    }

    @PatchMapping("/ratings")
    public Movie updateMovieRatings(@RequestParam(name = "imdbId") String imdbId, @RequestParam(name = "id") Long id, Authentication authentication) throws IOException {
        if(authentication == null) {
            throw new RuntimeException("You need to be logged in to update the ratings");
        }
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageService.getUserPage(currentUser);
        Movie movie = page.getMovies().stream().filter(m -> m.getId().equals(id)).findFirst().orElse(null);
        if(movie == null) {
            throw new PageNotFoundException("Movie not found in your library");
        }
        return movieService.updateMovieRatings(imdbId, id);
    }

    @PatchMapping("/{id}/watch-date")
    public Movie updateMovieWatchDate(@PathVariable Long id, @RequestParam(name = "watchDate") Long watchDate) {
        return movieService.updateMovieWatchDate(id, watchDate);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMovie(@PathVariable Long id, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());

        Page page = pageService.getUserPage(currentUser);
        Movie movie = page.getMovies().stream().filter(m -> m.getId().equals(id)).findFirst().orElse(null);
        if(movie == null) {
            throw new RuntimeException("Movie not found");
        }

        pageService.removeMovieFromPage(page.getId(), movie, currentUser).getMovies().remove(movie);
        movieService.deleteMovie(id);
    }

}
