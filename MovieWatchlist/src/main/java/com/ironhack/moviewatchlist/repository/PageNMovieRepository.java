package com.ironhack.moviewatchlist.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ironhack.moviewatchlist.model.NMovie;
import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.PageNMovie;

public interface PageNMovieRepository extends JpaRepository<PageNMovie, Long> {
    List<PageNMovie> findByPageId(Long id);

    Optional<PageNMovie> findByPageIdAndNmovieId(Long pageId, Long nmovieId);
}
