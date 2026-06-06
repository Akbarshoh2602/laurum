package com.aurum.crm.service.impl;

import com.aurum.crm.dto.request.CheckoutRequest;
import com.aurum.crm.dto.response.OrderResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.entity.*;
import com.aurum.crm.exception.BadRequestException;
import com.aurum.crm.exception.ResourceNotFoundException;
import com.aurum.crm.mapper.OrderMapper;
import com.aurum.crm.repository.CartRepository;
import com.aurum.crm.repository.OrderRepository;
import com.aurum.crm.repository.UserRepository;
import com.aurum.crm.security.SecurityUtils;
import com.aurum.crm.service.InventoryService;
import com.aurum.crm.service.OrderService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CartRepository cartRepository,
                            UserRepository userRepository,
                            InventoryService inventoryService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.inventoryService = inventoryService;
    }

    @Override
    @Transactional
    public OrderResponse checkout(CheckoutRequest request) {
        Long userId = SecurityUtils.currentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        // Validate stock first
        for (CartItem item : cart.getItems()) {
            if (item.getQuantity() > item.getProduct().getQuantity()) {
                throw new BadRequestException(
                        "Not enough stock for " + item.getProduct().getName());
            }
        }

        Order order = Order.builder()
                .user(user)
                .fullName(request.fullName())
                .phone(request.phone())
                .deliveryAddress(request.deliveryAddress())
                .status(OrderStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            BigDecimal unit = product.getSellingPrice();
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .quantity(item.getQuantity())
                    .unitPrice(unit)
                    .build();
            order.getItems().add(orderItem);
            total = total.add(unit.multiply(BigDecimal.valueOf(item.getQuantity())));

            // deduct inventory + log movement
            inventoryService.recordMovement(product, -item.getQuantity(),
                    "ORDER", "Order placed");
        }
        order.setTotalAmount(total);
        order = orderRepository.save(order);

        // clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return OrderMapper.toResponse(order);
    }

    @Override
    public PageResponse<OrderResponse> myOrders(Pageable pageable) {
        Long userId = SecurityUtils.currentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return PageResponse.from(
                orderRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                        .map(OrderMapper::toResponse));
    }

    @Override
    public OrderResponse getMyOrder(Long id) {
        Long userId = SecurityUtils.currentUserId();
        Order order = find(id);
        if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order not found: " + id);
        }
        return OrderMapper.toResponse(order);
    }

    @Override
    public PageResponse<OrderResponse> listAll(OrderStatus status, String search, Pageable pageable) {
        return PageResponse.from(
                orderRepository.search(status, search, pageable).map(OrderMapper::toResponse));
    }

    @Override
    public OrderResponse getOrder(Long id) {
        return OrderMapper.toResponse(find(id));
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus newStatus) {
        Order order = find(id);
        OrderStatus current = order.getStatus();
        if (current == newStatus) {
            return OrderMapper.toResponse(order);
        }

        boolean wasCancelled = current == OrderStatus.CANCELLED;
        boolean willBeCancelled = newStatus == OrderStatus.CANCELLED;

        // Cancelling restores inventory (only if it wasn't already cancelled)
        if (willBeCancelled && !wasCancelled) {
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null) {
                    inventoryService.recordMovement(item.getProduct(), item.getQuantity(),
                            "CANCEL #" + order.getId(), "Order cancelled - stock restored");
                }
            }
        }
        // Re-opening a cancelled order deducts stock again
        if (wasCancelled && !willBeCancelled) {
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null) {
                    if (item.getQuantity() > item.getProduct().getQuantity()) {
                        throw new BadRequestException(
                                "Cannot reopen: not enough stock for " + item.getProductName());
                    }
                    inventoryService.recordMovement(item.getProduct(), -item.getQuantity(),
                            "REOPEN #" + order.getId(), "Order reopened - stock deducted");
                }
            }
        }

        order.setStatus(newStatus);
        return OrderMapper.toResponse(orderRepository.save(order));
    }

    private Order find(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }
}
