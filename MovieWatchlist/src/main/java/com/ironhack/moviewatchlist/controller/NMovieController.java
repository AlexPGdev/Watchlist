package com.ironhack.moviewatchlist.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.access.method.P;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ironhack.moviewatchlist.dto.RatingResponse;
import com.ironhack.moviewatchlist.model.Movie;
import com.ironhack.moviewatchlist.model.NMovie;
import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.MovieRepository;
import com.ironhack.moviewatchlist.repository.PageRepository;
import com.ironhack.moviewatchlist.repository.UserRepository;
import com.ironhack.moviewatchlist.service.APIServices;
import com.ironhack.moviewatchlist.service.NMovieService;
import com.ironhack.moviewatchlist.service.PageService;

import info.movito.themoviedbapi.model.core.video.Video;
import info.movito.themoviedbapi.model.core.watchproviders.WatchProviders;
import info.movito.themoviedbapi.model.movies.MovieDb;
import info.movito.themoviedbapi.tools.TmdbException;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/nmovies")
public class NMovieController {

    private final NMovieService nmovieService;
    private final UserRepository userRepository;
    private final PageService pageService;
    private final MovieRepository movieRepository;
    private final APIServices apiServices;
    private final PageRepository pageRepository;

    public NMovieController(NMovieService nmovieService, UserRepository userRepository, PageService pageService, MovieRepository movieRepository, APIServices apiServices, PageRepository pageRepository) {
        this.nmovieService = nmovieService;
        this.userRepository = userRepository;
        this.pageService = pageService;
        this.movieRepository = movieRepository;
        this.apiServices = apiServices;
        this.pageRepository = pageRepository;
    }

    @GetMapping
    public List<NMovie> getAllMovies() {
        return nmovieService.getAllMovies();
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

    @GetMapping("/extended-details")
    public MovieDb getExtendedMovieDetails(@RequestParam int id) throws TmdbException {
        return apiServices.getExtendedMovieDetails(id);
    }

    @GetMapping("/ratings")
    public RatingResponse getMovieRatings(@RequestParam String id) throws IOException {
        return apiServices.getMovieRatings(id);
    }

    @GetMapping("/recommendations")
    public Mono<List<info.movito.themoviedbapi.model.core.Movie>> getRecommendations(Authentication authentication) throws TmdbException, IOException {
        User currentUser = userRepository.findByUsername(authentication.getName());
        // return movieService.getRecommendations(currentUser);
        return null;
    }

    @PostMapping
    public NMovie createMovie(@RequestBody NMovie nmovie) throws TmdbException {
        return nmovieService.createMovie(nmovie);
    }

    @PostMapping("/refresh/{tmdbId}")
    public NMovie refreshMovie(@PathVariable Integer tmdbId) throws TmdbException {
        return nmovieService.refreshMovie(tmdbId);
    }

    @PatchMapping("/{id}/ratings")
    public NMovie updateMovieRatings(@PathVariable Integer id, Authentication authentication) throws IOException {
        return nmovieService.updateMovieRatings(id);
    }

    @PatchMapping("/ambient-color")
    public NMovie updateAmbientColor(@RequestParam(name = "id") Long id, String color, Authentication authentication) {
        return nmovieService.updateAmbientColor(id, color);
    }

    @PatchMapping("/{id}/watch-date")
    public Movie updateMovieWatchDate(@PathVariable Long id, @RequestParam(name = "watchDate") Long watchDate) {
        return null;
    }
    
}
