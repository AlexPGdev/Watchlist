package com.ironhack.moviewatchlist.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ironhack.moviewatchlist.dto.PageNMovieDTO;
import com.ironhack.moviewatchlist.model.NMovie;
import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.PageNMovie;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.PageNMovieRepository;
import com.ironhack.moviewatchlist.repository.PageRepository;
import com.ironhack.moviewatchlist.repository.UserRepository;
import com.ironhack.moviewatchlist.service.NMovieService;
import com.ironhack.moviewatchlist.service.PageNMovieService;

import org.springframework.http.HttpStatus;

import info.movito.themoviedbapi.tools.TmdbException;

@RestController
@RequestMapping("/api/page-movies")
public class PageNMovieController {
    
    private final NMovieService nmovieService;
    private final PageNMovieService pageMovieService;
    private final UserRepository userRepository;
    private final PageRepository pageRepository;
    private final PageNMovieRepository pageNMovieRepository;

    public PageNMovieController(NMovieService nmovieService, PageNMovieService pageMovieService, UserRepository userRepository, PageRepository pageRepository, PageNMovieRepository pageNMovieRepository) {
        this.nmovieService = nmovieService;
        this.pageMovieService = pageMovieService;
        this.userRepository = userRepository;
        this.pageRepository = pageRepository;
        this.pageNMovieRepository = pageNMovieRepository;
    }

    @GetMapping
    public List<PageNMovieDTO> getAllMovies(Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageRepository.findByOwner(currentUser);
        return pageMovieService.getAllMovies(page.getId());
    }

    @GetMapping("/{username}")
    public List<PageNMovieDTO> getUserPage(@PathVariable String username) {
        return pageMovieService.getUserPage(username);
    }

    @PostMapping
    public NMovie addMovieToPage(Authentication authentication, @RequestBody NMovie movie) throws TmdbException {
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageRepository.findByOwner(currentUser);
        pageMovieService.addMovieToPage(page.getId(), movie);

        return movie;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMovieFromPage(@PathVariable Long id, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageRepository.findByOwnerUsername(currentUser.getUsername());
        
        pageMovieService.deleteMovieFromPage(page.getId(), id);
    }

    @PatchMapping("/{id}/watch")
    public PageNMovie updateMovieWatchStatus(@PathVariable Long id, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageRepository.findByOwnerUsername(currentUser.getUsername());

        return pageMovieService.updateMovieWatchStatus(page.getId(), id);
    }

    @PatchMapping("/{id}/rating")
    public PageNMovie updateMovieRating(@PathVariable Long id, @RequestParam(name = "rating") Integer rating, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageRepository.findByOwnerUsername(currentUser.getUsername());

        return pageMovieService.updateMovieRating(page.getId(), id, rating);
    }

    @PatchMapping("/{id}/watch-date")
    public PageNMovie updateMovieWatchDate(@PathVariable Long id, @RequestParam(name = "watchDate") Long watchDate, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        Page page = pageRepository.findByOwnerUsername(currentUser.getUsername());
        
        return pageMovieService.updateMovieWatchDate(page.getId(), id, watchDate);
    }

}
