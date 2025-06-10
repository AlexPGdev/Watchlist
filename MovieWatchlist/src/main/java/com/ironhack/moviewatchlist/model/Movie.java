package com.ironhack.moviewatchlist.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private int year;

    @ElementCollection
    private List<String> genres = new ArrayList<>();

    private boolean watched;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "watch_date")
    private Long watchDate;

    private String imdbId;
    private Integer tmdbId;

    private Integer rating = -1;

    @ElementCollection
    private List<String> streamingServices = new ArrayList<>();

    private double imdbRating;
    private String rtRating;

    public Movie() {
    }

    public Movie(String title, String description, int year, List<String> genres, boolean watched, String posterPath, Long watchDate, String imdbId, Integer tmdbId, List<String> streamingServices, Integer rating, double imdbRating, String rtRating) {
        this.title = title;
        this.description = description;
        this.year = year;
        this.genres = genres;
        this.watched = watched;
        this.posterPath = posterPath;
        this.watchDate = watchDate;
        this.imdbId = imdbId;
        this.tmdbId = tmdbId;
        this.streamingServices = streamingServices;
        this.rating = rating;
        this.imdbRating = imdbRating;
        this.rtRating = rtRating;
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

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public boolean isWatched() {
        return watched;
    }

    public void setWatched(boolean watched) {
        this.watched = watched;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public Long getWatchDate() {
        return watchDate;
    }

    public void setWatchDate(Long watchDate) {
        this.watchDate = watchDate;
    }

    public String getImdbId() {
        return imdbId;
    }

    public void setImdbId(String imdbId) {
        this.imdbId = imdbId;
    }

    public Integer getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(Integer tmdbId) {
        this.tmdbId = tmdbId;
    }

    public List<String> getStreamingServices() {
        return streamingServices;
    }

    public void setStreamingServices(List<String> streamingServices) {
        this.streamingServices = streamingServices;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public double getImdbRating() {
        return imdbRating;
    }

    public void setImdbRating(double imdbRating) {
        this.imdbRating = imdbRating;
    }

    public String getRtRating() {
        return rtRating;
    }

    public void setRtRating(String rtRating) {
        this.rtRating = rtRating;
    }
}
