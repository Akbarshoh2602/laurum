package com.aurum.crm.service.impl;

import com.aurum.crm.dto.request.LoginRequest;
import com.aurum.crm.dto.request.RegisterRequest;
import com.aurum.crm.dto.request.UpdateProfileRequest;
import com.aurum.crm.dto.response.AuthResponse;
import com.aurum.crm.dto.response.UserResponse;
import com.aurum.crm.entity.Role;
import com.aurum.crm.entity.User;
import com.aurum.crm.exception.BadRequestException;
import com.aurum.crm.exception.ResourceNotFoundException;
import com.aurum.crm.mapper.UserMapper;
import com.aurum.crm.repository.UserRepository;
import com.aurum.crm.security.AuthPrincipal;
import com.aurum.crm.security.SecurityUtils;
import com.aurum.crm.service.AuthService;
import com.aurum.crm.util.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String adminLogin;
    private final String adminPassword;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           @Value("${aurum.admin.login}") String adminLogin,
                           @Value("${aurum.admin.password}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.adminLogin = adminLogin;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        if (userRepository.existsByEmail(request.email().toLowerCase())) {
            throw new BadRequestException("Email is already registered");
        }
        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email().toLowerCase())
                .phone(request.phone())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.CUSTOMER)
                .active(true)
                .build();
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getId(), user.getEmail(), Role.CUSTOMER);
        return AuthResponse.of(token, UserMapper.toResponse(user));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Special administrator shortcut account (per spec): ADMIN123 / 6789
        if (adminLogin.equals(request.login()) && adminPassword.equals(request.password())) {
            String token = jwtService.generateToken(-1L, adminLogin, Role.ADMIN);
            UserResponse adminUser = new UserResponse(
                    0L, "AURUM", "Administrator", adminLogin, null, null,
                    Role.ADMIN.name(), true, null);
            return AuthResponse.of(token, adminUser);
        }

        // Regular customer login by email
        User user = userRepository.findByEmail(request.login().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid login credentials"));
        if (!user.isActive()) {
            throw new BadRequestException("Account is disabled");
        }
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadRequestException("Invalid login credentials");
        }
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return AuthResponse.of(token, UserMapper.toResponse(user));
    }

    @Override
    public UserResponse currentProfile() {
        return UserMapper.toResponse(currentUserEntity());
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request) {
        User user = currentUserEntity();
        if (StringUtils.hasText(request.firstName())) user.setFirstName(request.firstName());
        if (StringUtils.hasText(request.lastName())) user.setLastName(request.lastName());
        if (StringUtils.hasText(request.phone())) user.setPhone(request.phone());
        if (request.address() != null) user.setAddress(request.address());
        if (StringUtils.hasText(request.newPassword())) {
            if (request.newPassword().length() < 6) {
                throw new BadRequestException("Password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(request.newPassword()));
        }
        return UserMapper.toResponse(userRepository.save(user));
    }

    private User currentUserEntity() {
        AuthPrincipal principal = SecurityUtils.currentPrincipal();
        Long id = SecurityUtils.currentUserId();
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.subject()));
    }
}
