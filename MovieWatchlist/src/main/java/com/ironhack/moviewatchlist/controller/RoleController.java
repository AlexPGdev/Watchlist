package com.ironhack.moviewatchlist.controller;

import com.ironhack.moviewatchlist.dto.RoleToUserDTO;
import com.ironhack.moviewatchlist.model.Role;
import com.ironhack.moviewatchlist.model.User;
import com.ironhack.moviewatchlist.repository.UserRepository;
import com.ironhack.moviewatchlist.service.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RoleController {

    private final RoleService roleService;
    private final UserRepository userRepository;

    public RoleController(RoleService roleService, UserRepository userRepository) {
        this.roleService = roleService;
        this.userRepository = userRepository;
    }

    @PostMapping("/roles")
    @ResponseStatus(HttpStatus.CREATED)
    public void saveRole(@RequestBody Role role, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        if(currentUser.getRoles().stream().anyMatch(r -> r.getName().equals("Developer"))) {
            roleService.save(role);
        } else {
            throw new RuntimeException("You don't have permission to save roles");
        }
    }

    @PostMapping("/roles/add-to-user")
    @ResponseStatus(HttpStatus.OK)
    public void addRoleToUser(@RequestBody RoleToUserDTO roleToUserDTO, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        if(currentUser.getRoles().stream().anyMatch(r -> r.getName().equals("Developer"))) {
            roleService.addRoleToUser(roleToUserDTO.getUsername(), roleToUserDTO.getRoleName());
        } else {
            throw new RuntimeException("You don't have permission to add roles to users");
        }
    }
}
