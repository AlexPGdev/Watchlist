package com.ironhack.moviewatchlist.controller;

import com.ironhack.moviewatchlist.dto.CreateCollectionRequest;
import com.ironhack.moviewatchlist.dto.CreatePageRequest;
import com.ironhack.moviewatchlist.dto.PublicPageDTO;
import com.ironhack.moviewatchlist.exceptions.PageNotFoundException;
import com.ironhack.moviewatchlist.exceptions.PageNotPublicException;
import com.ironhack.moviewatchlist.model.Collection;
import com.ironhack.moviewatchlist.model.Movie;
import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.MovieRepository;
import com.ironhack.moviewatchlist.repository.UserRepository;
import com.ironhack.moviewatchlist.service.CollectionService;
import com.ironhack.moviewatchlist.service.MovieService;
import com.ironhack.moviewatchlist.service.PageService;
import com.ironhack.moviewatchlist.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/page")
public class PageController {

    private final PageService pageService;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    public PageController(PageService pageService, UserRepository userRepository, MovieRepository movieRepository) {
        this.pageService = pageService;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    @GetMapping
    public PublicPageDTO getUserPage(Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        if(pageService.getUserPublicPage(currentUser) == null) {
            pageService.createPage("Movie Watchlist", "My watchlist", true, currentUser);
        }
        if(!authentication.getName().equals(currentUser.getUsername()) && !pageService.getUserPublicPage(currentUser).isPublic()) {
            throw new PageNotPublicException("Page is not public");
        }
        return pageService.getUserPublicPage(currentUser);
    }

    @GetMapping("/{username}")
    public PublicPageDTO getUserPageByUsername(@PathVariable String username, Authentication authentication) {

        if(pageService.getUserPublicPageByUsername(username) == null) {
            throw new PageNotFoundException("Page not found");
        }

        if(authentication != null && !authentication.getName().equalsIgnoreCase(username) && !pageService.getUserPublicPageByUsername(username).isPublic() || authentication == null && !pageService.getUserPublicPageByUsername(username).isPublic()) {
            throw new PageNotPublicException("Page is not public");
        }

        return pageService.getUserPublicPageByUsername(username);
    }

    @PostMapping
    public ResponseEntity<Page> createPage(@RequestBody CreatePageRequest request, Authentication authentication) {
        try {
            User currentUser = userRepository.findByUsername(authentication.getName());
            Page page = pageService.createPage(request.getTitle(), request.getDescription(),
                    request.isPublic(), currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(page);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/page/{id}")
    public ResponseEntity<Page> updatePage(@PathVariable Long id, @RequestBody CreatePageRequest request,
                                           Authentication authentication) {
        try {
            User currentUser = userRepository.findByUsername(authentication.getName());
            Page page = pageService.updatePage(id, request.getTitle(), request.getDescription(),
                    request.isPublic(), currentUser);
            return ResponseEntity.ok(page);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/page/{id}")
    public ResponseEntity<Void> deletePage(@PathVariable Long id, Authentication authentication) {
        try {
            User currentUser = userRepository.findByUsername(authentication.getName());
            pageService.deletePage(id, currentUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("/page/{pageId}/movies/{movieId}")
    public ResponseEntity<Page> addMovieToPage(@PathVariable Long pageId, @PathVariable Long movieId,
                                               Authentication authentication) {
        try {
            User currentUser = userRepository.findByUsername(authentication.getName());
            Movie movie = movieRepository.findMovieById(movieId);
            Page page = pageService.addMovieToPage(pageId, movie, currentUser);
            return ResponseEntity.ok(page);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/page/{pageId}/movies/{movieId}")
    public ResponseEntity<Page> removeMovieFromPage(@PathVariable Long pageId, @PathVariable Long movieId,
                                                    Authentication authentication) {
        try {
            User currentUser = userRepository.findByUsername(authentication.getName());
            Movie movie = movieRepository.findMovieById(movieId);
            Page page = pageService.removeMovieFromPage(pageId, movie, currentUser);
            return ResponseEntity.ok(page);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/page/{pageId}/collections")
    public ResponseEntity<List<Collection>> getPageCollections(@PathVariable Long pageId, Authentication authentication) {
        try {
            User currentUser = userRepository.findByUsername(authentication.getName());
            Optional<Page> page = pageService.getPageById(pageId, currentUser);
            if (page.isPresent()) {
                List<Collection> collections = pageService.getPageCollections(pageId);
                return ResponseEntity.ok(collections);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/page/{pageId}/collections")
    public ResponseEntity<Collection> createCollection(@PathVariable Long pageId,
                                                       @RequestBody CreateCollectionRequest request,
                                                       Authentication authentication) {
        try {
            User currentUser = userRepository.findByUsername(authentication.getName());
            Collection collection = pageService.createCollection(pageId, request.getName(),
                    request.getDescription(), currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(collection);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }


}
