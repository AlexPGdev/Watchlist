package com.ironhack.moviewatchlist.demo;

import com.ironhack.moviewatchlist.model.Role;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.service.PageService;
import com.ironhack.moviewatchlist.service.RoleService;
import com.ironhack.moviewatchlist.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserService userService;
    private final RoleService roleService;
    private final PageService pageService;

    public DataLoader(UserService userService, RoleService roleService, PageService pageService) {
        this.userService = userService;
        this.roleService = roleService;
        this.pageService = pageService;
    }

    @Override
    public void run(String... args) throws Exception {
//        roleService.save(new Role("ROLE_USER"));
//        roleService.save(new Role("ROLE_ADMIN"));



//        userService.saveUser(new User("Alex", "alexpg", "1234", null));
//        userService.saveUser(new User("Awea", "Andrea", "1234", null));
//        userService.saveUser(new User("Peyv", "Peyv", "1234", null));
//
//        roleService.addRoleToUser("alexpg", "ROLE_USER");
//        roleService.addRoleToUser("alexpg", "ROLE_USER");
//        roleService.addRoleToUser("alexpg", "ROLE_USER");

        //pageService.createPage("Movie Watchlist", "Welcome to the Movie Watchlist!", true, userService.getUser("alexpg"));
    }

}
