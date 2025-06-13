package com.ironhack.moviewatchlist.model;

import jakarta.persistence.*;

@Entity
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String language;
    private String theme;
    private Integer view;
    private Integer gridSize;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Settings() {
    }

    public Settings(String language, String theme, Integer view, Integer gridSize, User user) {
        this.language = language;
        this.theme = theme;
        this.view = view;
        this.gridSize = gridSize;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Integer getView() {
        return view;
    }

    public void setView(Integer view) {
        this.view = view;
    }

    public Integer getGridSize() {
        return gridSize;
    }

    public void setGridSize(Integer gridSize) {
        this.gridSize = gridSize;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
