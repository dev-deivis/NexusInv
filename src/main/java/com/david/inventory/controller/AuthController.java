package com.david.inventory.controller;

import com.david.inventory.dto.request.LoginRequest;
import com.david.inventory.dto.response.AuthResponse;
import com.david.inventory.entity.User;
import com.david.inventory.repository.UserRepository;
import com.david.inventory.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String token = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .canEditProducts(user.isCanEditProducts())
                .canDeleteProducts(user.isCanDeleteProducts())
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(AuthResponse.builder()
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .canEditProducts(user.isCanEditProducts())
                .canDeleteProducts(user.isCanDeleteProducts())
                .build());
    }
}
