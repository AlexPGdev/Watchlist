package com.ironhack.moviewatchlist.dto;

public class SettingsDTO {
    private String language;
    private String theme;
    private Integer view;
    private Integer gridSize;

    public SettingsDTO() {
    }

    public SettingsDTO(String language, String theme, Integer view, Integer gridSize) {
        this.language = language;
        this.theme = theme;
        this.view = view;
        this.gridSize = gridSize;
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
}
