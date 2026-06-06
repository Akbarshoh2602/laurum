package com.aurum.crm.controller;

import com.aurum.crm.dto.response.ApiResponse;
import com.aurum.crm.dto.response.OrderResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.UserResponse;
import com.aurum.crm.service.CustomerService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerController {

    private final CustomerService customerService;

    public AdminCustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(customerService.list(search,
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(customerService.get(id));
    }

    @GetMapping("/{id}/orders")
    public ApiResponse<List<OrderResponse>> orders(@PathVariable Long id) {
        return ApiResponse.ok(customerService.orderHistory(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ApiResponse.ok("Customer deleted", null);
    }
}
