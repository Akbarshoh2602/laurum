package com.aurum.crm.service;

import com.aurum.crm.dto.request.LoginRequest;
import com.aurum.crm.dto.request.RegisterRequest;
import com.aurum.crm.dto.request.UpdateProfileRequest;
import com.aurum.crm.dto.response.AuthResponse;
import com.aurum.crm.dto.response.UserResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse currentProfile();
    UserResponse updateProfile(UpdateProfileRequest request);
}
