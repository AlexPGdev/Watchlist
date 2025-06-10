package com.ironhack.moviewatchlist.repository;

import com.ironhack.moviewatchlist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
    Optional<User> findByRememberMe(String rememberMe);
    List<User> findByUsernameContainingIgnoreCase(String query);
}
