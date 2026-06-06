package com.aurum.crm.controller;

import com.aurum.crm.dto.response.ApiResponse;
import com.aurum.crm.dto.response.OrderResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.entity.OrderStatus;
import com.aurum.crm.exception.BadRequestException;
import com.aurum.crm.service.OrderService;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        OrderStatus statusEnum = parseStatus(status);
        return ApiResponse.ok(orderService.listAll(statusEnum, search, PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(orderService.getOrder(id));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<OrderResponse> updateStatus(@PathVariable Long id,
                                                   @RequestParam String status) {
        OrderStatus statusEnum = parseStatus(status);
        if (statusEnum == null) {
            throw new BadRequestException("Invalid status: " + status);
        }
        return ApiResponse.ok("Order status updated", orderService.updateStatus(id, statusEnum));
    }

    private OrderStatus parseStatus(String status) {
        if (status == null || status.isBlank()) return null;
        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
