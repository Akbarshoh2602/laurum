package com.aurum.crm.repository;

import com.aurum.crm.entity.Cart;
import com.aurum.crm.entity.CartItem;
import com.aurum.crm.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
