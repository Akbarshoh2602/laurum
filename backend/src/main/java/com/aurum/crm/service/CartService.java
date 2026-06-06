package com.aurum.crm.service;

import com.aurum.crm.dto.request.CartItemRequest;
import com.aurum.crm.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart();
    CartResponse addItem(CartItemRequest request);
    CartResponse updateItem(Long productId, int quantity);
    CartResponse removeItem(Long productId);
    void clear();
}
