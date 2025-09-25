package com.ironhack.moviewatchlist.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_public")
    private boolean isPublic = true;

    @Column(name = "created_date")
    private Long createdDate;

    @OneToOne(fetch = FetchType.EAGER)
    private User owner;

    @Column(name = "owner_name")
    private String ownerName;

    // @OneToMany(mappedBy = "page", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Movie> movies = new ArrayList<>();

    // @OneToMany(mappedBy = "page", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Collection> collections = new ArrayList<>();

    @OneToMany(mappedBy = "page", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PageNMovie> pageNMovies = new ArrayList<>();

    public Page() {
        this.createdDate = System.currentTimeMillis();
    }

    public Page(String title, String description, boolean isPublic, User owner, String ownerName) {
        this.title = title;
        this.description = description;
        this.isPublic = isPublic;
        this.owner = owner;
        this.createdDate = System.currentTimeMillis();
        this.ownerName = ownerName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public Long getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Long createdDate) {
        this.createdDate = createdDate;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    // public List<Movie> getMovies() {
    //     return movies;
    // }

    // public void setMovies(List<Movie> movies) {
    //     this.movies = movies;
    // }

    // public List<Collection> getCollections() {
    //     return collections;
    // }

    // public void setCollections(List<Collection> collections) {
    //     this.collections = collections;
    // }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    // public void addMovie(Movie movie) {
    //     if (!this.movies.contains(movie)) {
    //         this.movies.add(movie);
    //     }
    // }

    // public void removeMovie(Movie movie) {
    //     this.movies.remove(movie);
    // }

    // public void addCollection(Collection collection) {
    //     this.collections.add(collection);
    //     collection.setPage(this);
    // }

    // public void removeCollection(Collection collection) {
    //     this.collections.remove(collection);
    //     collection.setPage(null);
    // }

    // @JsonIgnore
    public List<PageNMovie> getPageNMovies() {
        return pageNMovies;
    }

    public void setPageNMovies(List<PageNMovie> pageNMovies) {
        this.pageNMovies = pageNMovies;
    }

    public void addMovie(PageNMovie pageNMovie) {
        if (!this.pageNMovies.contains(pageNMovie)) {
            this.pageNMovies.add(pageNMovie);
        }
    }

    @JsonIgnore
    public void removeMovie(PageNMovie pageNMovie) {
        this.pageNMovies.remove(pageNMovie);
        pageNMovie.setPage(null);
    }
}
