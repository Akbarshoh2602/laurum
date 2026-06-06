package com.aurum.crm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "inventory_logs")
public class InventoryLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "previous_quantity", nullable = false)
    private Integer previousQuantity;

    @Column(name = "added_quantity", nullable = false)
    private Integer addedQuantity = 0;

    @Column(name = "removed_quantity", nullable = false)
    private Integer removedQuantity = 0;

    @Column(name = "current_quantity", nullable = false)
    private Integer currentQuantity;

    /** Who/what triggered the movement (e.g. "ADMIN", "ORDER #12", "CANCEL #12"). */
    @Column(name = "performed_by")
    private String performedBy;

    private String note;
}
