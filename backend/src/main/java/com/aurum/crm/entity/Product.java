package com.aurum.crm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(name = "product_code", unique = true)
    private String productCode;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    private String size;

    private String color;

    @Column(name = "purchase_price", precision = 12, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "selling_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal sellingPrice;

    @Column(nullable = false)
    private Integer quantity = 0;

    private String barcode;

    /** ACTIVE / INACTIVE */
    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(nullable = false)
    private boolean featured = false;

    @Column(name = "new_arrival", nullable = false)
    private boolean newArrival = false;

    @Column(name = "best_seller", nullable = false)
    private boolean bestSeller = false;
}
