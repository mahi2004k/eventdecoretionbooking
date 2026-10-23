package com.decor.booking.controller;

import com.decor.booking.entity.Admin;
import com.decor.booking.repository.AdminRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AdminAuthController {

    private final AdminRepository adminRepository;

    public AdminAuthController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin loginRequest) {
        Optional<Admin> admin = adminRepository.findByUsername(loginRequest.getUsername());

        // Simple credentials check (matches username and password)
        if (admin.isPresent() && admin.get().getPassword().equals(loginRequest.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", "ADMIN_SECRET_TOKEN_12345"); // Sample session token
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}