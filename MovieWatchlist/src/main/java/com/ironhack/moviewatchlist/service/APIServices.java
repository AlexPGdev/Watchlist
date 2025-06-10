package com.ironhack.moviewatchlist.service;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.core.Movie;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.core.watchproviders.ProviderResults;
import info.movito.themoviedbapi.model.core.watchproviders.WatchProviders;
import info.movito.themoviedbapi.model.movies.MovieDb;
import info.movito.themoviedbapi.tools.TmdbException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class APIServices {

    private final WebClient omdbWebClient;
    private final WebClient streamingAvailabilityWebClient;

    @Value("${api.omdb.key}")
    private String apiToken;

    @Value("${api.rapidapi.key}")
    private String rapidApiKey;

    TmdbApi tmdbApi = new TmdbApi("key");

    public APIServices(WebClient.Builder webClientBuilder) throws TmdbException {
        this.omdbWebClient = webClientBuilder.baseUrl("https://www.omdbapi.com").build();
        this.streamingAvailabilityWebClient = webClientBuilder.baseUrl("https://streaming-availability.p.rapidapi.com").build();
    }

    public List<Movie> searchMovies(String query) throws TmdbException {
        MovieResultsPage tmdbSearch = tmdbApi.getSearch().searchMovie(query, false, "en", null, 1, "de", null);

        System.out.println(tmdbSearch.getResults());
        return tmdbSearch.getResults();
//        return omdbWebClient.get()
//                .uri(uriBuilder -> uriBuilder
//                        .path("/")
//                        .queryParam("s", query)
//                        .queryParam("apikey", apiToken)
//                        .build())
//                .retrieve()
//                .bodyToMono(String.class);
    }

    public MovieDb getMovieDetails(Integer id) throws TmdbException {
        MovieDb tmdbMovie = tmdbApi.getMovies().getDetails(id, "en-US");
        return tmdbMovie;
//        return omdbWebClient.get()
//                .uri(uriBuilder -> uriBuilder
//                        .path("/")
//                        .queryParam("i", id)
//                        .queryParam("plot", "full")
//                        .queryParam("apikey", apiToken)
//                        .build(id))
//                .retrieve()
//                .bodyToMono(String.class);
    }

    public Map<String, WatchProviders> getStreamingAvailability(Integer id) throws TmdbException {
        ProviderResults watchProviders = tmdbApi.getMovies().getWatchProviders(id);
        return watchProviders.getResults();
    }
}