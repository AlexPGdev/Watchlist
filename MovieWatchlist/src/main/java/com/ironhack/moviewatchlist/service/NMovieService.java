package com.ironhack.moviewatchlist.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ironhack.moviewatchlist.model.NMovie;
import com.ironhack.moviewatchlist.repository.NMovieRepository;
import com.ironhack.moviewatchlist.repository.UserRepository;

import info.movito.themoviedbapi.model.core.video.Video;
import info.movito.themoviedbapi.model.movies.MovieDb;
import info.movito.themoviedbapi.tools.TmdbException;
import io.github.cdimascio.dotenv.Dotenv;

@Service
public class NMovieService {

        private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    private final NMovieRepository nmovieRepository;
    private final UserRepository userRepository;
    private final APIServices apiServices;
    private final PageService pageService;

    public NMovieService(NMovieRepository nmovieRepository, UserRepository userRepository, APIServices apiServices, PageService pageService) {
        this.nmovieRepository = nmovieRepository;
        this.userRepository = userRepository;
        this.apiServices = apiServices;
        this.pageService = pageService;
    }

    public List<NMovie> getAllMovies() {
        return nmovieRepository.findAll();
    }

    public NMovie createMovie(NMovie nmovie) throws TmdbException {
        NMovie saveNMovie = nmovieRepository.save(nmovie);

        NMovie nMovie = nmovieRepository.findById(saveNMovie.getId()).orElseThrow();
        Optional<Video> trailer = apiServices.getMovieTrailer(saveNMovie.getTmdbId());
        if(trailer.isPresent() && trailer.get().getKey() != null) {
            nMovie.setTrailerPath(trailer.get().getKey());
        }
        nmovieRepository.save(nMovie);

        return saveNMovie;
    }

    public NMovie updateMovieRatings(Integer id) throws IOException {
        NMovie movie = nmovieRepository.findByTmdbId(id);
        var imdbRating = apiServices.getMovieRatings(movie.getImdbId()).getImdbRating();
        var rtRating = apiServices.getMovieRatings(movie.getImdbId()).getRtRating();
        var rtAudienceRating = apiServices.getMovieRatings(movie.getImdbId()).getRtAudienceRating();
        movie.setImdbRating(imdbRating);
        movie.setRtRating(rtRating);
        movie.setRtAudienceRating(rtAudienceRating);
        nmovieRepository.save(movie);
        return movie;
    }

    public NMovie updateAmbientColor(Long id, String color) {
        NMovie movie = nmovieRepository.findById(id).orElseThrow();
        movie.setAmbientColor(color);
        return nmovieRepository.save(movie);
    }

    public NMovie refreshMovie(Integer tmdbId) throws TmdbException {
        // Delete genres
        // nmovie.getGenres()
        
        System.out.println("ASD:LAMLRMWLRMFLARFA");
        
        NMovie movie = nmovieRepository.findByTmdbId(tmdbId);

        MovieDb tmdbMovie = apiServices.getMovieDetails(tmdbId);

        movie.setTitle(tmdbMovie.getTitle());
        movie.setDescription(tmdbMovie.getOverview());
        movie.setYear(Integer.parseInt(tmdbMovie.getReleaseDate().split("-")[0]));
        movie.setGenres(new ArrayList<>(tmdbMovie.getGenres().stream().map(g -> g.getName()).toList()));
        movie.setPosterPath("https://image.tmdb.org/t/p/w500/" + tmdbMovie.getPosterPath());
        movie.setImdbId(tmdbMovie.getImdbID());
        movie.setTmdbId(tmdbMovie.getId());
        movie.setRuntime(tmdbMovie.getRuntime());
        movie.setCertification(tmdbMovie.getReleaseDates().getResults().stream().filter(r -> r.getIso31661().equals("US")).findFirst().get().getReleaseDates().stream().filter(r -> r.getCertification().trim().length() > 0).findFirst().get().getCertification());
        
        nmovieRepository.save(movie);
        
        Optional<Video> trailer = apiServices.getMovieTrailer(movie.getTmdbId());
        movie.setTrailerPath(trailer.get().getKey());
        nmovieRepository.save(movie);
        
        // System.out.println(nmovie.getGenres());
        return movie;
    }
    
}
