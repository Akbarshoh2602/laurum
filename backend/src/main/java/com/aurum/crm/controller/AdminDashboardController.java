package com.aurum.crm.controller;

import com.aurum.crm.dto.response.ApiResponse;
import com.aurum.crm.dto.response.DashboardResponse;
import com.aurum.crm.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    public AdminDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ApiResponse<DashboardResponse> dashboard() {
        return ApiResponse.ok(dashboardService.getDashboard());
    }
}
