package com.aurum.crm.service.impl;

import com.aurum.crm.dto.request.CartItemRequest;
import com.aurum.crm.dto.response.CartResponse;
import com.aurum.crm.entity.Cart;
import com.aurum.crm.entity.CartItem;
import com.aurum.crm.entity.Product;
import com.aurum.crm.entity.User;
import com.aurum.crm.exception.BadRequestException;
import com.aurum.crm.exception.ResourceNotFoundException;
import com.aurum.crm.mapper.CartMapper;
import com.aurum.crm.repository.CartItemRepository;
import com.aurum.crm.repository.CartRepository;
import com.aurum.crm.repository.ProductRepository;
import com.aurum.crm.repository.UserRepository;
import com.aurum.crm.security.SecurityUtils;
import com.aurum.crm.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public CartResponse getCart() {
        return CartMapper.toResponse(currentCart());
    }

    @Override
    @Transactional
    public CartResponse addItem(CartItemRequest request) {
        Cart cart = currentCart();
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + request.productId()));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product).orElse(null);
        int desired = (item != null ? item.getQuantity() : 0) + request.quantity();
        if (desired > product.getQuantity()) {
            throw new BadRequestException("Only " + product.getQuantity() + " in stock");
        }
        if (item == null) {
            item = CartItem.builder().cart(cart).product(product).quantity(request.quantity()).build();
            cart.getItems().add(item);
        } else {
            item.setQuantity(desired);
        }
        cartItemRepository.save(item);
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse updateItem(Long productId, int quantity) {
        Cart cart = currentCart();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new ResourceNotFoundException("Item not in cart"));
        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (quantity > product.getQuantity()) {
                throw new BadRequestException("Only " + product.getQuantity() + " in stock");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long productId) {
        Cart cart = currentCart();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        cartItemRepository.findByCartAndProduct(cart, product).ifPresent(item -> {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        });
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public void clear() {
        Cart cart = currentCart();
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart currentCart() {
        Long userId = SecurityUtils.currentUserId();
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
            return cartRepository.save(Cart.builder().user(user).build());
        });
    }
}
