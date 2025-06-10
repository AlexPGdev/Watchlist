package com.ironhack.moviewatchlist.controller;

import com.ironhack.moviewatchlist.exceptions.PageNotFoundException;
import com.ironhack.moviewatchlist.model.Movie;
import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.MovieRepository;
import com.ironhack.moviewatchlist.repository.UserRepository;
import com.ironhack.moviewatchlist.service.APIServices;
import com.ironhack.moviewatchlist.service.MovieService;
import com.ironhack.moviewatchlist.service.PageService;
import info.movito.themoviedbapi.model.core.watchproviders.WatchProviders;
import info.movito.themoviedbapi.model.movies.MovieDb;
import info.movito.themoviedbapi.tools.TmdbException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;
    private final UserRepository userRepository;
    private final PageService pageService;
    private final MovieRepository movieRepository;
    private final APIServices apiServices;

    public MovieController(MovieService movieService, UserRepository userRepository, PageService pageService, MovieRepository movieRepository, APIServices apiServices) {
        this.movieService = movieService;
        this.userRepository = userRepository;
        this.pageService = pageService;
        this.movieRepository = movieRepository;
        this.apiServices = apiServices;
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

    @GetMapping("/streaming-availability")
    public Map<String, WatchProviders> getStreamingAvailability(@RequestParam Integer id) throws TmdbException {
        return apiServices.getStreamingAvailability(id);
    }

    @GetMapping("/recommendations")
    public Mono<List<info.movito.themoviedbapi.model.core.Movie>> getRecommendations(Authentication authentication) throws TmdbException {
        User currentUser = userRepository.findByUsername(authentication.getName());
        return movieService.getRecommendations(currentUser);
    }

    @PostMapping
    public Movie createMovie(@RequestBody Movie movie, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());

        Page page = pageService.getUserPage(currentUser);
        if(page == null) {
            pageService.createPage("Movie Watchlist", "My watchlist", true, currentUser);
            page = pageService.getUserPage(currentUser);
        }

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
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageService.getUserPage(currentUser);
        Movie movie = page.getMovies().stream().filter(m -> m.getId().equals(id)).findFirst().orElse(null);
        if(movie == null) {
            throw new PageNotFoundException("Movie not found in your library");
        }
        return movieService.updateMovieRating(id, rating);
    }

    @PatchMapping("/{id}/watch-date")
    public Movie updateMovieWatchDate(@PathVariable Long id, @RequestParam(name = "watchDate") Long watchDate) {
        return movieService.updateMovieWatchDate(id, watchDate);
    }

    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Long id, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());

        Page page = pageService.getUserPage(currentUser);
        Movie movie = page.getMovies().stream().filter(m -> m.getId().equals(id)).findFirst().orElse(null);
        if(movie == null) {
            throw new RuntimeException("Movie not found");
        }
        pageService.removeMovieFromPage(page.getId(), movie, currentUser);
        movieService.deleteMovie(id);
    }

}
