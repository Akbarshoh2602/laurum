package com.aurum.crm.service;

import com.aurum.crm.dto.request.CheckoutRequest;
import com.aurum.crm.dto.response.OrderResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.entity.OrderStatus;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse checkout(CheckoutRequest request);
    PageResponse<OrderResponse> myOrders(Pageable pageable);
    OrderResponse getMyOrder(Long id);

    // admin
    PageResponse<OrderResponse> listAll(OrderStatus status, String search, Pageable pageable);
    OrderResponse getOrder(Long id);
    OrderResponse updateStatus(Long id, OrderStatus status);
}
