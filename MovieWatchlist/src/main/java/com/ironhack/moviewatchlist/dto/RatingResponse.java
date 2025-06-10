package com.ironhack.moviewatchlist.dto;

public class RatingResponse {
    private double imdbRating;
    private String rtRating;

    public RatingResponse() {
    }

    public RatingResponse(double imdbRating, String rtRating) {
        this.imdbRating = imdbRating;
        this.rtRating = rtRating;
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