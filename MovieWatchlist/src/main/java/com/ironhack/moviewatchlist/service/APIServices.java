package com.ironhack.moviewatchlist.service;

import com.ironhack.moviewatchlist.dto.RatingResponse;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.core.Movie;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.core.watchproviders.ProviderResults;
import info.movito.themoviedbapi.model.core.watchproviders.WatchProviders;
import info.movito.themoviedbapi.model.movies.MovieDb;
import info.movito.themoviedbapi.tools.TmdbException;
import io.github.cdimascio.dotenv.Dotenv;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class APIServices {

    private static final Dotenv dotenv = Dotenv.configure().load();

    private final WebClient omdbWebClient;

    private String omdbKey = dotenv.get("OMDB_KEY");
    private String rapidapiKey = dotenv.get("RAPIDAPI_KEY");
    private String tmdbKey = dotenv.get("TMDB_KEY");

    TmdbApi tmdbApi = new TmdbApi(tmdbKey);

    public APIServices(WebClient.Builder webClientBuilder) throws TmdbException {
        this.omdbWebClient = webClientBuilder.baseUrl("https://www.omdbapi.com").build();
    }

    public List<Movie> searchMovies(String query) throws TmdbException {

        MovieResultsPage tmdbSearch = tmdbApi.getSearch().searchMovie(query, false, "en", null, 1, "de", null);

        System.out.println(tmdbSearch.getResults());
        return tmdbSearch.getResults();
    }

    public MovieDb getMovieDetails(Integer id) throws TmdbException {
        MovieDb tmdbMovie = tmdbApi.getMovies().getDetails(id, "en-US");
        return tmdbMovie;
    }

    public Map<String, WatchProviders> getStreamingAvailability(Integer id) throws TmdbException {
        ProviderResults watchProviders = tmdbApi.getMovies().getWatchProviders(id);
        return watchProviders.getResults();
    }

    public RatingResponse getMovieRatings(String id) throws IOException {
        String result = omdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/")
                        .queryParam("apikey", omdbKey)
                        .queryParam("tomatoes", "true")
                        .queryParam("i", id)
                        .build(id))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        JSONObject obj = new JSONObject(result);
        String tomatoUrl = obj.getString("tomatoURL");

        Document imdb = Jsoup.connect("https://www.imdb.com/title/" + id + "/").get();
        Document rt = Jsoup.connect(tomatoUrl).get();

        Elements imdbRatingElement = imdb.select("div.sc-8eab3bd3-0:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(2) > span:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1)");
        Elements rtRatingElement = rt.select(".media-scorecard > media-scorecard:nth-child(1) > rt-text:nth-child(3)");

        if (imdbRatingElement.isEmpty() || rtRatingElement.isEmpty()) {
            throw new IOException("Could not find rating elements on one of the pages.");
        }

        double imdbRating = Double.parseDouble(imdbRatingElement.text());
        String rtRating = rtRatingElement.text();

        return new RatingResponse(imdbRating, rtRating);
    }
}