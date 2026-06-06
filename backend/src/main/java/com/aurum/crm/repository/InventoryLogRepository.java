package com.aurum.crm.repository;

import com.aurum.crm.entity.InventoryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    Page<InventoryLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
