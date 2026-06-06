package com.aurum.crm.service.impl;

import com.aurum.crm.dto.response.OrderResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.UserResponse;
import com.aurum.crm.entity.Role;
import com.aurum.crm.entity.User;
import com.aurum.crm.exception.ResourceNotFoundException;
import com.aurum.crm.mapper.OrderMapper;
import com.aurum.crm.mapper.UserMapper;
import com.aurum.crm.repository.OrderRepository;
import com.aurum.crm.repository.UserRepository;
import com.aurum.crm.service.CustomerService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public CustomerServiceImpl(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public PageResponse<UserResponse> list(String search, Pageable pageable) {
        return PageResponse.from(
                userRepository.searchByRole(Role.CUSTOMER, search, pageable)
                        .map(UserMapper::toResponse));
    }

    @Override
    public UserResponse get(Long id) {
        return UserMapper.toResponse(findCustomer(id));
    }

    @Override
    public List<OrderResponse> orderHistory(Long id) {
        User customer = findCustomer(id);
        return orderRepository.findByUserOrderByCreatedAtDesc(customer, PageRequest.of(0, 100))
                .map(OrderMapper::toResponse).getContent();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        userRepository.delete(findCustomer(id));
    }

    private User findCustomer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
        if (user.getRole() != Role.CUSTOMER) {
            throw new ResourceNotFoundException("Customer not found: " + id);
        }
        return user;
    }
}
