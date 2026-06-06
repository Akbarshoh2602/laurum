package com.aurum.crm.service;

import com.aurum.crm.dto.response.OrderResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {
    PageResponse<UserResponse> list(String search, Pageable pageable);
    UserResponse get(Long id);
    List<OrderResponse> orderHistory(Long id);
    void delete(Long id);
}
