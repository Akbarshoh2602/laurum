package com.aurum.crm.controller;

import com.aurum.crm.dto.request.CheckoutRequest;
import com.aurum.crm.dto.response.ApiResponse;
import com.aurum.crm.dto.response.OrderResponse;
import com.aurum.crm.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ApiResponse<OrderResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        return ApiResponse.ok("Order placed successfully", orderService.checkout(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getMyOrder(@PathVariable Long id) {
        return ApiResponse.ok(orderService.getMyOrder(id));
    }
}
