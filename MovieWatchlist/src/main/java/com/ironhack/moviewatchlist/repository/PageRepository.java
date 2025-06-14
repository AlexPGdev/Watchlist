package com.ironhack.moviewatchlist.repository;

import com.ironhack.moviewatchlist.model.Page;
import com.ironhack.moviewatchlist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page, Long> {
    Page findByOwner(User owner);

    @Query("SELECT p FROM Page p WHERE p.owner.username = :username")
    Page findByOwnerUsername(@Param("username") String username);
}
