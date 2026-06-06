package com.aurum.crm.repository;

import com.aurum.crm.entity.Order;
import com.aurum.crm.entity.OrderStatus;
import com.aurum.crm.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    long countByStatus(OrderStatus status);

    @Query("""
            SELECT o FROM Order o
            WHERE (:status IS NULL OR o.status = :status)
              AND (:search IS NULL OR :search = ''
                   OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR o.phone LIKE CONCAT('%', :search, '%')
                   OR CAST(o.id AS string) LIKE CONCAT('%', :search, '%'))
            ORDER BY o.createdAt DESC
            """)
    Page<Order> search(@Param("status") OrderStatus status,
                       @Param("search") String search,
                       Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = com.aurum.crm.entity.OrderStatus.COMPLETED")
    BigDecimal totalRevenue();

    @Query("""
            SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o
            WHERE o.status = com.aurum.crm.entity.OrderStatus.COMPLETED
              AND EXTRACT(YEAR FROM o.createdAt) = :year
              AND EXTRACT(MONTH FROM o.createdAt) = :month
            """)
    BigDecimal revenueForMonth(@Param("year") int year, @Param("month") int month);

    @Query("""
            SELECT EXTRACT(MONTH FROM o.createdAt) AS m, COALESCE(SUM(o.totalAmount), 0) AS revenue, COUNT(o) AS orders
            FROM Order o
            WHERE o.status = com.aurum.crm.entity.OrderStatus.COMPLETED
              AND EXTRACT(YEAR FROM o.createdAt) = :year
            GROUP BY EXTRACT(MONTH FROM o.createdAt)
            ORDER BY m
            """)
    List<Object[]> monthlySales(@Param("year") int year);
}
