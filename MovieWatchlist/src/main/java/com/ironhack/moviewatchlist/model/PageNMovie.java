package com.ironhack.moviewatchlist.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
// @Table(name = "page_movie")
public class PageNMovie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    @JsonIgnore
    private Page page;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nmovie_id", nullable = false)
    @JsonIgnore
    private NMovie nmovie;

    private boolean watched;

    @Column(name = "watch_date")
    private Long watchDate;

    private Integer rating = -1;

    private Long addedDate;

    public PageNMovie() {
        this.addedDate = System.currentTimeMillis();
    }

    public PageNMovie(Page page, NMovie nmovie, boolean watched, Long watchDate, Integer rating) {
        this.page = page;
        this.nmovie = nmovie;
        this.watched = watched;
        this.watchDate = watchDate;
        this.rating = rating;
        this.addedDate = System.currentTimeMillis();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }

    public NMovie getNMovie() {
        return nmovie;
    }

    public void setNMovie(NMovie nmovie) {
        this.nmovie = nmovie;
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

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Long getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(Long addedDate) {
        this.addedDate = addedDate;
    }

}
