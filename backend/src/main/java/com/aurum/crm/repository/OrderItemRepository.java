package com.aurum.crm.repository;

import com.aurum.crm.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
            SELECT oi.productName AS name, SUM(oi.quantity) AS qty
            FROM OrderItem oi
            GROUP BY oi.productName
            ORDER BY qty DESC
            """)
    List<Object[]> topSellingProducts(Pageable pageable);
}
