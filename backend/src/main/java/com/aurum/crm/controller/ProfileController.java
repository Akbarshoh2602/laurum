package com.aurum.crm.controller;

import com.aurum.crm.dto.request.UpdateProfileRequest;
import com.aurum.crm.dto.response.ApiResponse;
import com.aurum.crm.dto.response.OrderResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.UserResponse;
import com.aurum.crm.service.AuthService;
import com.aurum.crm.service.OrderService;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final AuthService authService;
    private final OrderService orderService;

    public ProfileController(AuthService authService, OrderService orderService) {
        this.authService = authService;
        this.orderService = orderService;
    }

    @GetMapping
    public ApiResponse<UserResponse> me() {
        return ApiResponse.ok(authService.currentProfile());
    }

    @PutMapping
    public ApiResponse<UserResponse> update(@RequestBody UpdateProfileRequest request) {
        return ApiResponse.ok("Profile updated", authService.updateProfile(request));
    }

    @GetMapping("/orders")
    public ApiResponse<PageResponse<OrderResponse>> myOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(orderService.myOrders(PageRequest.of(page, size)));
    }
}
