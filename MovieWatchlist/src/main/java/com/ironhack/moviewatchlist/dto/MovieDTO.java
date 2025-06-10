package com.ironhack.moviewatchlist.dto;

import com.ironhack.moviewatchlist.model.Movie;

import java.util.ArrayList;

public class MovieDTO {
    private String title;
    private String description;
    private int year;
    private String posterPath;
    private boolean watched;
    private int tmdbId;
    private ArrayList<String> streamingServices;
    private ArrayList<String> genres;
    private Long watchDate;
    private String profileOwner;

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
}


/*
                        title: movieDetails.title,
                        description: movieDetails.overview,
                        watched: false,
                        year: movieDetails.release_date.split('-')[0],
                        genres: movieDetails.genres.map(g => g.name).join(', ').split(',').map(g => g.trim()),
                        posterPath: "https://image.tmdb.org/t/p/w500" + movieDetails.poster_path,
                        tmdbId: movieDetails.id,
                        streamingServices: []
 */