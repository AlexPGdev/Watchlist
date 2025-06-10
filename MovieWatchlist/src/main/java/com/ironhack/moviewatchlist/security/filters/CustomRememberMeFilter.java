package com.ironhack.moviewatchlist.security.filters;

import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

public class CustomRememberMeFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    public CustomRememberMeFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Only proceed if no authentication is set
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            // Read the cookie
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("remember-me".equals(cookie.getName())) {
                        String token = cookie.getValue();
                        // Look up the user by token
                        Optional<User> optionalUser = userRepository.findByRememberMe(token);
                        if (optionalUser.isPresent()) {
                            User userEntity = optionalUser.get();

                            // Create Authentication token
                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            userEntity.getUsername(),
                                            null,
                                            Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")) // customize if needed
                                    );

                            // Set authentication in context
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            break;
                        }
                    }
                }
            }
        }

        // Continue the chain
        filterChain.doFilter(request, response);
    }
}