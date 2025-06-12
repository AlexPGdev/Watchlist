package com.ironhack.moviewatchlist.repository;

import com.ironhack.moviewatchlist.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Movie findMovieById(Long id);

    @Query("SELECT m FROM Movie m WHERE m.imdbId = :id")
    List<Movie> findByImdbId(String id);
}
