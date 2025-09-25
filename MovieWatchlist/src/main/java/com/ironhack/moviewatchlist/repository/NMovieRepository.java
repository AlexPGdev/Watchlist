package com.ironhack.moviewatchlist.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ironhack.moviewatchlist.model.NMovie;

public interface NMovieRepository extends JpaRepository<NMovie, Long> {
    NMovie findNMovieById(Long id);

    @Query("SELECT m FROM NMovie m WHERE m.imdbId = :id")
    NMovie findByImdbId(String id);

    @Query("SELECT m FROM NMovie m WHERE m.tmdbId = :id")
    NMovie findByTmdbId(Integer id);
}
