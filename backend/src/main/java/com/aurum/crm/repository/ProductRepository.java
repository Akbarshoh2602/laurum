package com.aurum.crm.repository;

import com.aurum.crm.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            SELECT p FROM Product p
            WHERE (:search IS NULL OR :search = ''
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(p.productCode) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:categoryId IS NULL OR p.category.id = :categoryId)
              AND (:status IS NULL OR :status = '' OR p.status = :status)
            """)
    Page<Product> search(@Param("search") String search,
                         @Param("categoryId") Long categoryId,
                         @Param("status") String status,
                         Pageable pageable);

    List<Product> findByFeaturedTrueAndStatus(String status);

    List<Product> findByNewArrivalTrueAndStatus(String status);

    List<Product> findByBestSellerTrueAndStatus(String status);

    @Query("SELECT p FROM Product p WHERE p.quantity <= :threshold ORDER BY p.quantity ASC")
    List<Product> findLowStock(@Param("threshold") int threshold);

    long countByQuantityLessThanEqual(int threshold);
}
