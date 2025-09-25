package com.ironhack.moviewatchlist.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ironhack.moviewatchlist.dto.PageNMovieDTO;
import com.ironhack.moviewatchlist.model.Movie;
import com.ironhack.moviewatchlist.model.NMovie;
import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.PageNMovie;
import com.ironhack.moviewatchlist.repository.NMovieRepository;
import com.ironhack.moviewatchlist.repository.PageNMovieRepository;
import com.ironhack.moviewatchlist.repository.PageRepository;

import info.movito.themoviedbapi.tools.TmdbException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class PageNMovieService {
    private final NMovieRepository nmovieRepository;
    private final PageRepository pageRepository;
    private final PageNMovieRepository pageMovieRepository;
    private final NMovieService nmovieService;

    public PageNMovieService(NMovieRepository nmovieRepository, PageRepository pageRepository, PageNMovieRepository pageMovieRepository, NMovieService nmovieService) {
        this.nmovieRepository = nmovieRepository;
        this.pageRepository = pageRepository;
        this.pageMovieRepository = pageMovieRepository;
        this.nmovieService = nmovieService;
    }

    public List<PageNMovieDTO> getAllMovies(Long pageId) {
        Page page = pageRepository.findById(pageId).orElseThrow();
        return page.getPageNMovies()
                    .stream()
                    .map(PageNMovieDTO::new)
                    .toList();
    }

    public List<PageNMovieDTO> getUserPage(String username) {
        Page page = pageRepository.findByOwnerUsername(username);
        return page.getPageNMovies()
                    .stream()
                    .filter(p -> p.getNMovie().getImdbId() != null)
                    .map(PageNMovieDTO::new)
                    .toList();
    }

    public void addMovieToPage(Long pageId, NMovie movie) throws TmdbException {
        NMovie nmovie = nmovieRepository.findByTmdbId(movie.getTmdbId());

        if(nmovie == null) {
            nmovieService.createMovie(movie);

            nmovie = nmovieRepository.findByTmdbId(movie.getTmdbId());

            Page page = pageRepository.findById(pageId).orElseThrow();

            PageNMovie pageMovie = new PageNMovie();
            pageMovie.setPage(page);
            pageMovie.setNMovie(nmovie);
            pageMovie.setWatched(false);
            pageMovie.setRating(null);
            pageMovie.setAddedDate(System.currentTimeMillis());
            pageMovie.setWatchDate(0L);
            
            pageMovieRepository.save(pageMovie);
        } else {
            Page page = pageRepository.findById(pageId).orElseThrow();

            PageNMovie pageMovie = new PageNMovie();
            pageMovie.setPage(page);
            pageMovie.setNMovie(nmovie);
            pageMovie.setWatched(false);
            pageMovie.setRating(null);
            pageMovie.setAddedDate(System.currentTimeMillis());
            pageMovie.setWatchDate(0L);
            
            pageMovieRepository.save(pageMovie);
            
        }
    }

    public void deleteMovieFromPage(Long pageId, Long nmovieId) {
        Optional<PageNMovie> pageNMovie = pageMovieRepository.findById(nmovieId);

        if(pageNMovie.get().getPage().getId().equals(pageId)){
            pageMovieRepository.delete(pageNMovie.get());
        } else {
            throw new RuntimeException("You cannot delete this movie");
        }
    }

    public PageNMovie updateMovieWatchStatus(Long pageId, Long nmovieId) {
        Page page = pageRepository.findById(pageId).get();
        Optional<PageNMovie> pageNMovie = pageMovieRepository.findById(nmovieId);

        if(pageNMovie.get().getPage().getId().equals(pageId)){
            pageNMovie.get().setWatched(!pageNMovie.get().isWatched());
            if(pageNMovie.get().isWatched()) {
                pageNMovie.get().setWatchDate(new Date().getTime());
            } else {
                pageNMovie.get().setWatchDate(null);
            }
            pageMovieRepository.save(pageNMovie.get());
            return page.getPageNMovies().stream().filter(p -> p.getNMovie().getId().equals(pageNMovie.get().getNMovie().getId())).findFirst().get();
        } else {
            throw new RuntimeException("You cannot change the status of this movie");
        }
    }

    public PageNMovie updateMovieRating(Long pageId, Long nmovieId, Integer rating) {
        Page page = pageRepository.findById(pageId).get();
        Optional<PageNMovie> pageNMovie = pageMovieRepository.findById(nmovieId);

        if(pageNMovie.get().getPage().getId().equals(pageId)){
            pageNMovie.get().setRating(rating);
            pageMovieRepository.save(pageNMovie.get());
            return page.getPageNMovies().stream().filter(p -> p.getNMovie().getId().equals(pageNMovie.get().getNMovie().getId())).findFirst().get();
        } else {
            throw new RuntimeException("You cannot change the rating of this movie");
        }
    }

    public PageNMovie updateMovieWatchDate(Long pageId, Long nmovieId, Long watchDate) {
        Page page = pageRepository.findById(pageId).get();
        Optional<PageNMovie> pageNMovie = pageMovieRepository.findById(nmovieId);

        if(pageNMovie.get().getPage().getId().equals(page.getId())){
            pageNMovie.get().setWatchDate(watchDate);
            pageMovieRepository.save(pageNMovie.get());
            return page.getPageNMovies().stream().filter(p -> p.getNMovie().getId().equals(pageNMovie.get().getNMovie().getId())).findFirst().get();
        } else {
            throw new RuntimeException("You cannot change the watch date of this movie");
        }
    }
}
