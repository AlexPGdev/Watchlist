package com.ironhack.moviewatchlist.service;

import com.ironhack.moviewatchlist.dto.RatingResponse;
import com.ironhack.moviewatchlist.repository.MovieRepository;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.collections.Images;
import info.movito.themoviedbapi.model.core.Movie;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.core.image.Image;
import info.movito.themoviedbapi.model.core.video.Video;
import info.movito.themoviedbapi.model.core.watchproviders.ProviderResults;
import info.movito.themoviedbapi.model.core.watchproviders.WatchProviders;
import info.movito.themoviedbapi.model.movies.Cast;
import info.movito.themoviedbapi.model.movies.Credits;
import info.movito.themoviedbapi.model.movies.MovieDb;
import info.movito.themoviedbapi.tools.TmdbException;
import info.movito.themoviedbapi.tools.appendtoresponse.MovieAppendToResponse;
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
import java.util.Optional;

@Service
public class APIServices {
    private final MovieRepository movieRepository;

    private static final Dotenv dotenv = Dotenv.configure().directory("D:\\watchlist-react\\Watchlist\\MovieWatchlist\\.env").load();

    private final WebClient omdbWebClient;

    private String omdbKey = dotenv.get("OMDB_KEY");
    private String rapidapiKey = dotenv.get("RAPIDAPI_KEY");
    private String tmdbKey = dotenv.get("TMDB_KEY");

    TmdbApi tmdbApi = new TmdbApi(tmdbKey);

    public APIServices(WebClient.Builder webClientBuilder, MovieRepository movieRepository) throws TmdbException {
        this.omdbWebClient = webClientBuilder.baseUrl("https://www.omdbapi.com").build();
        this.movieRepository = movieRepository;
    }

    public List<Movie> searchMovies(String query) throws TmdbException {

        MovieResultsPage tmdbSearch = tmdbApi.getSearch().searchMovie(query, false, "en", null, 1, "de", null);

        System.out.println(tmdbSearch.getResults());
        return tmdbSearch.getResults();
    }

    public MovieDb getMovieDetails(Integer id) throws TmdbException {
        MovieDb tmdbMovie = tmdbApi.getMovies().getDetails(id, "en-US", MovieAppendToResponse.CREDITS, MovieAppendToResponse.IMAGES, MovieAppendToResponse.VIDEOS);
        System.out.println("MOVIE DETAILS!!!!!!");
        System.out.println(tmdbMovie);
        return tmdbMovie;
    }

    public Optional<Video> getMovieTrailer(int tmdbId) throws TmdbException {
        List<Video> videos = tmdbApi.getMovies().getVideos(tmdbId, "en-US").getResults();
        Optional<Video> trailer = videos.stream().filter(v -> v.getType().equals("Trailer")).findFirst();
        return trailer;
    }

    public Map<String, WatchProviders> getStreamingAvailability(Integer id) throws TmdbException {
        ProviderResults watchProviders = tmdbApi.getMovies().getWatchProviders(id);
        return watchProviders.getResults();
    }

    public MovieDb getExtendedMovieDetails(Integer id) throws TmdbException {
        MovieDb tmdbMovie = tmdbApi.getMovies().getDetails(id, "en", MovieAppendToResponse.RECOMMENDATIONS, MovieAppendToResponse.CREDITS, MovieAppendToResponse.IMAGES);
        return tmdbMovie;
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

        Elements imdbRatingElement = imdb.select("#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-358297d7-0.CHcbB > section > div:nth-child(5) > section > section > div.sc-b234497d-3.ffckSa > div.sc-8e956c5c-0.cfWEab.sc-13687a64-1.iWItnY > div > div:nth-child(1) > a > span > div > div.sc-4dc495c1-0.fUqjJu > div.sc-4dc495c1-2.jaffDQ > span.sc-4dc495c1-1.lbQcRY");
        Elements rtRatingElement = rt.select(".media-scorecard > media-scorecard:nth-child(1) > rt-text:nth-child(3)");

        if (imdbRatingElement.isEmpty() || rtRatingElement.isEmpty()) {
            throw new IOException("Could not find rating elements on one of the pages.");
        }

        double imdbRating = Double.parseDouble(imdbRatingElement.text());
        String rtRating = rtRatingElement.text();

        return new RatingResponse(imdbRating, rtRating);
    }
}