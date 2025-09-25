package com.ironhack.moviewatchlist.dto;

public class RatingResponse {
    private double imdbRating;
    private String rtRating;
    private String rtAudienceRating;

    public RatingResponse() {
    }

    public RatingResponse(double imdbRating, String rtRating, String rtAudienceRating) {
        this.imdbRating = imdbRating;
        this.rtRating = rtRating;
        this.rtAudienceRating = rtAudienceRating;
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
}