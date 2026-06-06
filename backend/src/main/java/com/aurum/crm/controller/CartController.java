package com.aurum.crm.controller;

import com.aurum.crm.dto.request.CartItemRequest;
import com.aurum.crm.dto.response.ApiResponse;
import com.aurum.crm.dto.response.CartResponse;
import com.aurum.crm.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ApiResponse<CartResponse> getCart() {
        return ApiResponse.ok(cartService.getCart());
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addItem(@Valid @RequestBody CartItemRequest request) {
        return ApiResponse.ok("Added to cart", cartService.addItem(request));
    }

    @PutMapping("/items/{productId}")
    public ApiResponse<CartResponse> updateItem(@PathVariable Long productId,
                                                @RequestParam int quantity) {
        return ApiResponse.ok(cartService.updateItem(productId, quantity));
    }

    @DeleteMapping("/items/{productId}")
    public ApiResponse<CartResponse> removeItem(@PathVariable Long productId) {
        return ApiResponse.ok("Removed from cart", cartService.removeItem(productId));
    }

    @DeleteMapping
    public ApiResponse<Void> clear() {
        cartService.clear();
        return ApiResponse.ok("Cart cleared", null);
    }
}
