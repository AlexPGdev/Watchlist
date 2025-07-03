package com.ironhack.moviewatchlist.dto;

import com.ironhack.moviewatchlist.model.Movie;

import java.util.ArrayList;

public class MovieDTO {
    private String title;
    private String description;
    private int year;
    private String posterPath;
    private String trailerPath;
    private boolean watched;
    private int tmdbId;
    private ArrayList<String> streamingServices;
    private ArrayList<String> genres;
    private Long watchDate;
    private String profileOwner;
    private Long addedDate;

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

    public boolean isWatched() {
        return watched;
    }

    public void setWatched(boolean watched) {
        this.watched = watched;
    }

    public int getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(int tmdbId) {
        this.tmdbId = tmdbId;
    }

    public ArrayList<String> getStreamingServices() {
        return streamingServices;
    }

    public void setStreamingServices(ArrayList<String> streamingServices) {
        this.streamingServices = streamingServices;
    }

    public ArrayList<String> getGenres() {
        return genres;
    }

    public void setGenres(ArrayList<String> genres) {
        this.genres = genres;
    }

    public Long getWatchDate() {
        return watchDate;
    }

    public void setWatchDate(Long watchDate) {
        this.watchDate = watchDate;
    }

    public String getProfileOwner() {
        return profileOwner;
    }

    public void setProfileOwner(String profileOwner) {
        this.profileOwner = profileOwner;
    }

    public Long getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(Long addedDate) {
        this.addedDate = addedDate;
    }
}