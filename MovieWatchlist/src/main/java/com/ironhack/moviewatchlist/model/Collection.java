package com.ironhack.moviewatchlist.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Collection {

    @Id
    private Long id;

    private String name;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_date")
    private Long createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id", nullable = false)
    @JsonIgnore
    private Page page;

    @ManyToMany
    @JoinTable(
            name = "collection_movies",
            joinColumns = @JoinColumn(name = "collection_id"),
            inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    private List<NMovie> nmovies = new ArrayList<>();

    public Collection() {
        this.createdDate = System.currentTimeMillis();
    }

    public Collection(String name, String description, Page page) {
        this.name = name;
        this.description = description;
        this.page = page;
        this.createdDate = System.currentTimeMillis();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Long createdDate) {
        this.createdDate = createdDate;
    }

    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }

    public List<NMovie> getMovies() {
        return nmovies;
    }

    public void setMovies(List<NMovie> nmovies) {
        this.nmovies = nmovies;
    }

    public void addMovie(NMovie nmovie) {
        if (!this.nmovies.contains(nmovie)) {
            this.nmovies.add(nmovie);
        }
    }

    public void removeMovie(NMovie nmovie) {
        this.nmovies.remove(nmovie);
    }
}
