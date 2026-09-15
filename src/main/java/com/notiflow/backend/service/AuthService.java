package com.notiflow.backend.service;

import com.notiflow.backend.dto.request.LoginRequest;
import com.notiflow.backend.dto.request.RegisterRequest;
import com.notiflow.backend.dto.response.LoginResponse;
import com.notiflow.backend.entity.Preference;
import com.notiflow.backend.entity.User;
import com.notiflow.backend.exception.DuplicateResourceException;
import com.notiflow.backend.repository.PreferenceRepository;
import com.notiflow.backend.repository.UserRepository;
import com.notiflow.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        // Auto-create default preferences for the new user
        Preference preference = new Preference();
        preference.setUser(user);
        preferenceRepository.save(preference);

        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponse(token, user.getEmail(), user.getName());
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponse(token, user.getEmail(), user.getName());
    }
}