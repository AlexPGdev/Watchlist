package com.ironhack.moviewatchlist.service;

import com.ironhack.moviewatchlist.dto.MovieDTO;
import com.ironhack.moviewatchlist.model.Movie;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.MovieRepository;
import com.ironhack.moviewatchlist.repository.UserRepository;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;
import info.movito.themoviedbapi.tools.TmdbException;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.transaction.Transactional;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class MovieService {

    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final APIServices apiServices;
    private final PageService pageService;

    public MovieService(MovieRepository movieRepository, UserRepository userRepository, APIServices apiServices, PageService pageService) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.apiServices = apiServices;
        this.pageService = pageService;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie createMovie(Movie movie, User currentUser) {
        User user = userRepository.findByUsername(currentUser.getUsername());

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return movieRepository.save(movie);
    }

    public Movie updateMovieWatchStatus(Long id, User currentUser) {
        var movie = movieRepository.findById(id).orElseThrow();
        movie.setWatched(!movie.isWatched());
        if(movie.isWatched()) {
            movie.setWatchDate(new Date().getTime());
        } else {
            movie.setWatchDate(null);
        }
        return movieRepository.save(movie);
    }

    public Movie updateMovieWatchDate(Long id, Long watchDate) {
        var movie = movieRepository.findById(id).orElseThrow();
        movie.setWatchDate(watchDate);
        return movieRepository.save(movie);
    }

    public Movie updateMovieRating(Long id, Integer rating) {
        var movie = movieRepository.findById(id).orElseThrow();
        movie.setRating(rating);
        return movieRepository.save(movie);
    }

    public Movie updateMovieRatings(String imdbId, Long id) throws IOException {
        var movie = movieRepository.findById(id).orElseThrow();
        var movies = movieRepository.findByImdbId(imdbId);
        var imdbRating = apiServices.getMovieRatings(imdbId).getImdbRating();
        var rtRating = apiServices.getMovieRatings(imdbId).getRtRating();

        movies.forEach(m -> {
            m.setImdbRating(imdbRating);
            m.setRtRating(rtRating);
            movieRepository.save(m);
        });

        return movie;
    }

    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id).orElse(null);
        if (movie != null) {
            movieRepository.deleteById(id);
        }
    }

    public Movie addStreamingService(Long id, String streamingService) {
        Movie movie = movieRepository.findById(id).orElseThrow();
        movie.getStreamingServices().add(streamingService);
        return movieRepository.save(movie);
    }

    public Mono<List<info.movito.themoviedbapi.model.core.Movie>> getRecommendations(User user) throws TmdbException {
        return getChatGPT(user);
    }

    public Mono<List<info.movito.themoviedbapi.model.core.Movie>> getChatGPT(User user) throws TmdbException {
        OpenAIClient client = OpenAIOkHttpClient.builder()
                .apiKey(dotenv.get("OPENAI_KEY"))
                .build();

        User username = userRepository.findByUsername(user.getUsername());
        List<Movie> watchedMovies = pageService.getUserPageMovies(username).stream().filter(m -> m.isWatched()).toList();
        List<Movie> toWatchMovies = pageService.getUserPageMovies(username).stream().filter(m -> !m.isWatched()).toList();
        System.out.println(watchedMovies.stream().map(m -> m.getTitle() + " - " + m.getRating()).collect(Collectors.joining("\n")));
        System.out.println(toWatchMovies.stream().map(m -> m.getTitle()).collect(Collectors.joining("\n")));

        String instructions = "You are integrated on a website where users add movies to their watchlist. The users can rate the movies in this way after they watch it: Did not like it Liked it Loved it Based on the watched movies, and their ratings given by the user, you have to recommend other movies for them to watch. Give your response in the following json format: \"\n" +
                "{\n" +
                "\"recommendations\":\n" +
                "[\n" +
                "{\n" +
                "\"title\": \"Title of the movie\",\n" +
                "\"description\": \"Description of the movie\",\n" +
                "\"why\": \"Why it was recommended\"\n" +
                "}\n" +
                "]\n" +
                "}\n" +
                "\"\n" +
                "In the why sections always refer to the user as you.\n" +
                "The following list of movies will be given in the following format:\n" +
                "\"Title of movie - Rating\"\n" +
                "In rating 0 will mean Did not like it, 1 will mean they liked it and 2 will mean the loved it. null or -1 means that the movie was not rated.\n" +
                "Recommend movies based on what movies they rated higher, but don't take that as the only criteria. Also think about the overall movies watched, the genre of the movies watched and about what is happening in the world, like trending movies, etc.\n" +
                "Here is the list:\n" +
                watchedMovies.stream().map(m -> m.getTitle() + " - " + m.getRating()).collect(Collectors.joining("\n")) +
                "\n" +
                "Here is a list that the user already has on the list so DO NOT RECOMMEND ANY OF THE FOLLOWING MOVIES:\n" +
                toWatchMovies.stream().map(m -> m.getTitle()).collect(Collectors.joining("\n")) +
                "\n" +
                "Please limit your response to 3 movies.\n";

        ResponseCreateParams params = ResponseCreateParams.builder()
                .input(instructions)
                .model(ChatModel.GPT_4_1_MINI)
                .maxOutputTokens(400)
                .build();

        Response response = client.responses().create(params);
        System.out.println(response.output().get(0).message().get().content().get(0).outputText().get().text());

        String responseText = response.output().get(0).message().get().content().get(0).outputText().get().text();


        JSONObject jsonObject = new JSONObject(responseText.replace("```json", "").replace("```", ""));
        //System.out.println(jsonObject.getJSONArray("recommendations").getJSONObject(0).getString("title"));

        List<info.movito.themoviedbapi.model.core.Movie> movie1 = apiServices.searchMovies(jsonObject.getJSONArray("recommendations").getJSONObject(0).getString("title"));
        List<info.movito.themoviedbapi.model.core.Movie> movie2 = apiServices.searchMovies(jsonObject.getJSONArray("recommendations").getJSONObject(1).getString("title"));
        List<info.movito.themoviedbapi.model.core.Movie> movie3 = apiServices.searchMovies(jsonObject.getJSONArray("recommendations").getJSONObject(2).getString("title"));


        System.out.println(Flux.concat(Flux.fromIterable(movie1), Flux.fromIterable(movie2), Flux.fromIterable(movie3)));

        return Flux.concat(Flux.fromIterable(movie1), Flux.fromIterable(movie2), Flux.fromIterable(movie3)).collectList(); // ✅ Return the actual movie data as a Flux
    }

}
