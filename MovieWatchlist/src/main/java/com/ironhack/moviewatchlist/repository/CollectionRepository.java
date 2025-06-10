package com.ironhack.moviewatchlist.repository;

import com.ironhack.moviewatchlist.model.Collection;
import com.ironhack.moviewatchlist.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByPage(Page page);

    List<Collection> findByPageId(Long pageId);

    List<Collection> findByPageOrderByCreatedDateDesc(Page page);
}
