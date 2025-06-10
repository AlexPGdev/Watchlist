package com.ironhack.moviewatchlist.service;

import com.ironhack.moviewatchlist.model.Collection;
import com.ironhack.moviewatchlist.model.Movie;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.CollectionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class CollectionService {

    private final CollectionRepository collectionRepository;

    public CollectionService(CollectionRepository collectionRepository) {
        this.collectionRepository = collectionRepository;
    }

    public Optional<Collection> getCollectionById(Long id, User currentUser) {
        Optional<Collection> collection = collectionRepository.findById(id);
        if(collection.isPresent()) {
            Collection c = collection.get();
            if(c.getPage().getOwner().equals(currentUser) || c.getPage().isPublic()) {
                return collection;
            }
        }
        return Optional.empty();
    }

    public Collection updateCollection(Long id, String name, String description, User currentUser) {
        Optional<Collection> collectionOpt = collectionRepository.findById(id);
        if (collectionOpt.isPresent()) {
            Collection collection = collectionOpt.get();
            if (collection.getPage().getOwner().equals(currentUser)) {
                collection.setName(name);
                collection.setDescription(description);
                return collectionRepository.save(collection);
            }
        }
        throw new RuntimeException("Collection not found or you don't have permission to update it");
    }

    public void deleteCollection(Long id, User currentUser) {
        Optional<Collection> collectionOpt = collectionRepository.findById(id);
        if (collectionOpt.isPresent()) {
            Collection collection = collectionOpt.get();
            if (collection.getPage().getOwner().equals(currentUser)) {
                collectionRepository.delete(collection);
                return;
            }
        }
        throw new RuntimeException("Collection not found or you don't have permission to update it");
    }

    public Collection addMovieToCollection(Long collectionId, Movie movie, User currentUser) {
        Optional<Collection> collectionOpt = collectionRepository.findById(collectionId);
        if (collectionOpt.isPresent()) {
            Collection collection = collectionOpt.get();
            if (collection.getPage().getOwner().equals(currentUser)) {
                collection.addMovie(movie);
                return collectionRepository.save(collection);
            }
        }
        throw new RuntimeException("Collection not found or you don't have permission to update it");
    }

    public Collection removeMovieFromCollection(Long collectionId, Movie movie, User currentUser) {
        Optional<Collection> collectionOpt = collectionRepository.findById(collectionId);
        if (collectionOpt.isPresent()) {
            Collection collection = collectionOpt.get();
            if (collection.getPage().getOwner().equals(currentUser)) {
                collection.removeMovie(movie);
                return collectionRepository.save(collection);
            }
        }
        throw new RuntimeException("Collection not found or you don't have permission to update it");
    }

}
