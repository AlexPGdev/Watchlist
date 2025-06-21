package com.ironhack.moviewatchlist.service;

import com.ironhack.moviewatchlist.dto.PublicPageDTO;
import com.ironhack.moviewatchlist.model.Movie;
import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.PageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PageService {

    private final PageRepository pageRepository;

    public PageService(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    public Page createPage(String title, String description, boolean isPublic, User owner) {
        System.out.println(owner.getName());
        Page page = new Page(title, description, isPublic, owner, owner.getUsername());
        return pageRepository.save(page);
    }

    public Page getUserPage(User user) {
        return pageRepository.findByOwner(user);
    }

    public PublicPageDTO getUserPublicPage(User user) {
        Page page = pageRepository.findByOwner(user);
        if(page == null) {
            return null;
        }
        PublicPageDTO publicPageDTO = new PublicPageDTO();
        publicPageDTO.setTitle(page.getTitle());
        publicPageDTO.setDescription(page.getDescription());
        publicPageDTO.setPublic(page.isPublic());
        publicPageDTO.setOwnerName(page.getOwnerName());
        publicPageDTO.setId(page.getId());
        publicPageDTO.setMovies(page.getMovies());


        return publicPageDTO;
    }

    public PublicPageDTO getUserPublicPageByUsername(String username) {
        Page page = pageRepository.findByOwnerUsername(username);
        if(page == null) {
            return null;
        }
        PublicPageDTO publicPageDTO = new PublicPageDTO();
        publicPageDTO.setTitle(page.getTitle());
        publicPageDTO.setDescription(page.getDescription());
        publicPageDTO.setPublic(page.isPublic());
        publicPageDTO.setOwnerName(page.getOwnerName());
        publicPageDTO.setId(page.getId());
        publicPageDTO.setMovies(page.getMovies());
        return publicPageDTO;
    }

    public List<Movie> getUserPageMovies(User user) {
        return pageRepository.findByOwner(user).getMovies();
    }

    public Page updatePage(Long id, String title, String description, boolean isPublic, User currentUser) {
        Optional<Page> pageOpt = pageRepository.findById(id);
        if(pageOpt.isPresent()) {
            Page page = pageOpt.get();
            if(page.getOwner().equals(currentUser)) {
                page.setTitle(title);
                page.setDescription(description);
                page.setPublic(isPublic);
                return pageRepository.save(page);
            }
        }
        throw new RuntimeException("Page not found or you don't have permission to update it");
    }

    public void deletePage(Long id, User currentUser) {
        Optional<Page> pageOpt = pageRepository.findById(id);
        if(pageOpt.isPresent()) {
            Page page = pageOpt.get();
            if(page.getOwner().equals(currentUser)) {
                pageRepository.delete(page);
                return;
            }
        }
        throw new RuntimeException("Page not found or you don't have permission to delete it");
    }

    public Page addMovieToPage(Long pageId, Movie movie, User currentUser) {
        Optional<Page> pageOpt = pageRepository.findById(pageId);
        if(pageOpt.isPresent()) {
            Page page = pageOpt.get();
            if(page.getOwner().equals(currentUser)) {
                page.addMovie(movie);
                return pageRepository.save(page);
            }
        }
        throw new RuntimeException("Page not found or you don't have permission to add movies to it");
    }

    @Transactional
    public Page removeMovieFromPage(Long pageId, Movie movie, User currentUser) {
        Optional<Page> pageOpt = pageRepository.findById(pageId);
        if(pageOpt.isPresent()) {
            Page page = pageOpt.get();
            if(page.getOwner().equals(currentUser)) {
                page.removeMovie(movie);
                pageRepository.save(page);
                return page;
            }
        }
        throw new RuntimeException("Page not found or you don't have permission to remove movies from it");
    }
}
