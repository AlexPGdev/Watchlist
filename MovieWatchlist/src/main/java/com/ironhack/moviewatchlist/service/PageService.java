package com.ironhack.moviewatchlist.service;

import com.ironhack.moviewatchlist.dto.PublicPageDTO;
import com.ironhack.moviewatchlist.exceptions.PageNotPublicException;
import com.ironhack.moviewatchlist.model.Collection;
import com.ironhack.moviewatchlist.model.Movie;
import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.CollectionRepository;
import com.ironhack.moviewatchlist.repository.PageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static org.aspectj.weaver.Shadow.ExceptionHandler;

@Service
@Transactional
public class PageService {

    private final PageRepository pageRepository;
    private final CollectionRepository collectionRepository;

    public PageService(PageRepository pageRepository, CollectionRepository collectionRepository) {
        this.pageRepository = pageRepository;
        this.collectionRepository = collectionRepository;
    }

    public Page createPage(String title, String description, boolean isPublic, User owner) {
        Page page = new Page(title, description, isPublic, owner, owner.getName());
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

    public Page getPublicPages(User user) {
        return pageRepository.findByOwnerAndIsPublic(user, true);
    }

    public Page getPublicPageByUsername(String username) {
        return pageRepository.findPublicPageByOwnerUsername(username);
    }

    public List<Movie> getMoviesByUsername(String username) {
        return pageRepository.findPublicPageByOwnerUsername(username).getMovies();
    }

    public List<Page> getAllPublicPages() {
        return pageRepository.findAllPublicPages();
    }

    public Optional<Page> getPageById(Long id, User currentUser) {
        Optional<Page> page = pageRepository.findById(id);
        if(page.isPresent()) {
            Page p = page.get();
            if(p.getOwner().equals(currentUser) || p.isPublic()) {
                return page;
            }
        }
        return Optional.empty();
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

    public Page removeMovieFromPage(Long pageId, Movie movie, User currentUser) {
        Optional<Page> pageOpt = pageRepository.findById(pageId);
        if(pageOpt.isPresent()) {
            Page page = pageOpt.get();
            if(page.getOwner().equals(currentUser)) {
                page.removeMovie(movie);
                return pageRepository.save(page);
            }
        }
        throw new RuntimeException("Page not found or you don't have permission to remove movies from it");
    }

    public Collection createCollection(Long pageId, String name, String description, User currentUser) {
        Optional<Page> pageOpt = pageRepository.findById(pageId);
        if(pageOpt.isPresent()) {
            Page page = pageOpt.get();
            if(page.getOwner().equals(currentUser)) {
                Collection collection = new Collection(name, description, page);
                Collection savedCollection = collectionRepository.save(collection);
                page.addCollection(savedCollection);
                pageRepository.save(page);
                return savedCollection;
            }
        }
        throw new RuntimeException("Page not found or you don't have permission to create collections on it");
    }

    public List<Collection> getPageCollections(Long pageId) {
        return collectionRepository.findByPageId(pageId);
    }

}
