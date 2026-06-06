package com.aurum.crm.mapper;

import com.aurum.crm.dto.response.CartResponse;
import com.aurum.crm.entity.Cart;
import com.aurum.crm.entity.CartItem;

import java.math.BigDecimal;
import java.util.List;

public final class CartMapper {
    private CartMapper() {}

    public static CartResponse toResponse(Cart cart) {
        List<CartResponse.CartItemResponse> items = cart.getItems().stream()
                .map(CartMapper::toItem)
                .toList();
        BigDecimal grandTotal = items.stream()
                .map(CartResponse.CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalItems = cart.getItems().stream().mapToInt(CartItem::getQuantity).sum();
        return new CartResponse(cart.getId(), items, grandTotal, totalItems);
    }

    private static CartResponse.CartItemResponse toItem(CartItem item) {
        BigDecimal unit = item.getProduct().getSellingPrice();
        BigDecimal lineTotal = unit.multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartResponse.CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImageUrl(),
                unit,
                item.getQuantity(),
                item.getProduct().getQuantity(),
                lineTotal
        );
    }
}
