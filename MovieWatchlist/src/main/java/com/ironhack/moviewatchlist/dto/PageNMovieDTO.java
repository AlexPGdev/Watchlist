package com.ironhack.moviewatchlist.dto;

import java.util.ArrayList;
import java.util.List;

import com.ironhack.moviewatchlist.model.PageNMovie;

public class PageNMovieDTO {
    private Long id;
    private String title;
    private String description;
    private boolean watched;
    private Long watchDate;
    private int year;
    private List<String> genres;
    private List<String> streamingServices;
    private String posterPath;
    private String trailerPath;
    private String imdbId;
    private Integer tmdbId;
    private Integer rating;
    private double imdbRating;
    private String rtRating;
    private String rtAudienceRating;
    private String ambientColor;
    private Integer runtime;
    private String certification;

    public PageNMovieDTO(PageNMovie pageNMovie) {
        this.id = pageNMovie.getId();
        this.title = pageNMovie.getNMovie().getTitle();
        this.description = pageNMovie.getNMovie().getDescription();
        this.watched = pageNMovie.isWatched();
        this.watchDate = pageNMovie.getWatchDate();
        this.year = pageNMovie.getNMovie().getYear();
        this.genres = pageNMovie.getNMovie().getGenres();
        this.posterPath = pageNMovie.getNMovie().getPosterPath();
        this.trailerPath = pageNMovie.getNMovie().getTrailerPath();
        this.imdbId = pageNMovie.getNMovie().getImdbId();
        this.tmdbId = pageNMovie.getNMovie().getTmdbId();
        this.rating = pageNMovie.getRating();
        this.imdbRating = pageNMovie.getNMovie().getImdbRating();
        this.rtRating = pageNMovie.getNMovie().getRtRating();
        this.rtAudienceRating = pageNMovie.getNMovie().getRtAudienceRating();
        this.ambientColor = pageNMovie.getNMovie().getAmbientColor();
        this.runtime = pageNMovie.getNMovie().getRuntime();
        this.certification = pageNMovie.getNMovie().getCertification();
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

    public boolean isWatched() {
        return watched;
    }

    public void setWatched(boolean watched) {
        this.watched = watched;
    }

    public Long getWatchDate() {
        return watchDate;
    }

    public void setWatchDate(Long watchDate) {
        this.watchDate = watchDate;
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

    public List<String> getStreamingServices() {
        return streamingServices;
    }

    public void setStreamingServices(List<String> streamingServices) {
        this.streamingServices = streamingServices;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public String getTrailerPath() {
        return trailerPath;
    }

    public void setTrailerPath(String trailerPath) {
        this.trailerPath = trailerPath;
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

    public String getRtAudienceRating() {
        return rtAudienceRating;
    }

    public void setRtAudienceRating(String rtAudienceRating) {
        this.rtAudienceRating = rtAudienceRating;
    }

    public String getAmbientColor() {
        return ambientColor;
    }

    public void setAmbientColor(String ambientColor) {
        this.ambientColor = ambientColor;
    }

    public Integer getRuntime() {
        return runtime;
    }

    public void setRuntime(Integer runtime) {
        this.runtime = runtime;
    }

    public String getCertification() {
        return certification;
    }

    public void setCertification(String certification) {
        this.certification = certification;
    }
    
}
