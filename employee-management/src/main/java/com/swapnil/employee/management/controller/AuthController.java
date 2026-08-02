package com.swapnil.employee.management.controller;

import com.swapnil.employee.management.entity.User;
import com.swapnil.employee.management.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Map<String, String> request) {

        String token = authService.login(
                request.get("username"),
                request.get("password")
        );

        return ResponseEntity.ok(Map.of("token", token));
    }
}
