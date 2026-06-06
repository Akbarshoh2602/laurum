package com.aurum.crm.mapper;

import com.aurum.crm.dto.response.OrderResponse;
import com.aurum.crm.entity.Order;
import com.aurum.crm.entity.OrderItem;

import java.math.BigDecimal;
import java.util.List;

public final class OrderMapper {
    private OrderMapper() {}

    public static OrderResponse toResponse(Order o) {
        List<OrderResponse.OrderItemResponse> items = o.getItems().stream()
                .map(OrderMapper::toItem)
                .toList();
        String customerName = o.getUser() != null
                ? o.getUser().getFirstName() + " " + o.getUser().getLastName()
                : o.getFullName();
        return new OrderResponse(
                o.getId(),
                o.getUser() != null ? o.getUser().getId() : null,
                customerName,
                o.getFullName(),
                o.getPhone(),
                o.getDeliveryAddress(),
                o.getStatus().name(),
                o.getTotalAmount(),
                items,
                o.getCreatedAt()
        );
    }

    private static OrderResponse.OrderItemResponse toItem(OrderItem i) {
        BigDecimal lineTotal = i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()));
        return new OrderResponse.OrderItemResponse(
                i.getId(),
                i.getProduct() != null ? i.getProduct().getId() : null,
                i.getProductName(),
                i.getQuantity(),
                i.getUnitPrice(),
                lineTotal
        );
    }
}
