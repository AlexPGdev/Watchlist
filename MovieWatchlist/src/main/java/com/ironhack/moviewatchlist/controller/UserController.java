package com.ironhack.moviewatchlist.controller;

import com.ironhack.moviewatchlist.dto.SettingsDTO;
import com.ironhack.moviewatchlist.exceptions.NotLoggedInException;
import com.ironhack.moviewatchlist.exceptions.UsernameAlreadyExistsException;
import com.ironhack.moviewatchlist.model.Settings;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.UserRepository;
import com.ironhack.moviewatchlist.service.PageService;
import com.ironhack.moviewatchlist.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PageService pageService;

    public UserController(UserService userService, UserRepository userRepository, PageService pageService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.pageService = pageService;
    }

    @GetMapping("/user")
    public User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new NotLoggedInException("Not logged in");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("remember-me".equals(cookie.getName())) {
                    userRepository.findByRememberMe(cookie.getValue()).ifPresent(user -> {
                        user.setRememberMe(null);
                        userRepository.save(user);
                    });

                    cookie.setValue("");
                    cookie.setMaxAge(0);
                    cookie.setPath("/");
                    cookie.setHttpOnly(true);
                    cookie.setSecure(true);
                    cookie.setAttribute("SameSite", "None");
                    response.addCookie(cookie);
                }
            }
        }

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/users")
    @ResponseStatus(HttpStatus.OK)
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchUsers(@RequestParam String q) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(q);
        List<String> usernames = users.stream()
                .map(User::getUsername)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usernames);
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public String signup(@RequestBody @Valid User user) {
        if(userService.getUser(user.getUsername()) != null) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        user.setSettings(new Settings("en", "default", 1, 3, user));

        userService.saveUser(user);
        pageService.createPage("Movie Watchlist", "Welcome to the Movie Watchlist!", true, user);

        return "User created successfully";
    }

    @GetMapping("/settings")
    public SettingsDTO getSettings(Authentication authentication) {
        if(authentication == null) {
            throw new NotLoggedInException("Not logged in");
        }
        User currentUser = userRepository.findByUsername(authentication.getName());
        if(currentUser == null) {
            throw new RuntimeException("User not found");
        }
        SettingsDTO settingsDTO = new SettingsDTO(currentUser.getSettings().getLanguage(), currentUser.getSettings().getTheme(), currentUser.getSettings().getView(), currentUser.getSettings().getGridSize());
        return settingsDTO;
    }

    @PatchMapping("/settings")
    public Settings updateSettings(@RequestBody SettingsDTO settings, Authentication authentication) {
        if(authentication == null) {
            throw new NotLoggedInException("Not logged in");
        }
        User currentUser = userRepository.findByUsername(authentication.getName());
        if(currentUser == null) {
            throw new RuntimeException("User not found");
        }

        if (settings.getTheme() != null) {
            currentUser.getSettings().setTheme(settings.getTheme());
        }
        if (settings.getLanguage() != null) {
            currentUser.getSettings().setLanguage(settings.getLanguage());
        }
        if (settings.getView() != null) {
            currentUser.getSettings().setView(settings.getView());
        }
        if (settings.getGridSize() != null) {
            currentUser.getSettings().setGridSize(settings.getGridSize());
        }

        return userRepository.save(currentUser).getSettings();
    }
}
