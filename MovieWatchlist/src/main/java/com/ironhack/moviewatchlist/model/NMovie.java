package com.ironhack.moviewatchlist.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "nmovie")
public class NMovie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private int year;

    @ElementCollection
    @CollectionTable(name = "nmovie_genres", joinColumns = @JoinColumn(name = "nmovie_id"))
    private List<String> genres = new ArrayList<>();

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "trailer_path")
    private String trailerPath;

    private String imdbId;
    private Integer tmdbId;

    @ElementCollection
    private List<String> streamingServices = new ArrayList<>();

    private double imdbRating;
    private String rtRating;
    private String rtAudienceRating;

    private String ambientColor;

    private Integer runtime;

    private String certification;

    public NMovie() {
    }

    public NMovie(String title, String description, int year, List<String> genres, String posterPath, String trailerPath, String imdbId, Integer tmdbId, List<String> streamingServices, double imdbRating, String rtRating, String rtAudienceRating, String ambientColor, Integer runtime, String certification) {
        this.title = title;
        this.description = description;
        this.year = year;
        this.genres = genres;
        this.posterPath = posterPath;
        this.trailerPath = trailerPath;
        this.imdbId = imdbId;
        this.tmdbId = tmdbId;
        this.streamingServices = streamingServices;
        this.imdbRating = imdbRating;
        this.rtRating = rtRating;
        this.rtAudienceRating = rtAudienceRating;
        this.ambientColor = ambientColor;
        this.runtime = runtime;
        this.certification = certification;
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

    public List<String> getStreamingServices() {
        return streamingServices;
    }

    public void setStreamingServices(List<String> streamingServices) {
        this.streamingServices = streamingServices;
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
