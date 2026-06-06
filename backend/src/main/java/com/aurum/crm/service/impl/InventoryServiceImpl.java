package com.aurum.crm.service.impl;

import com.aurum.crm.dto.request.StockAdjustRequest;
import com.aurum.crm.dto.response.InventoryLogResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.ProductResponse;
import com.aurum.crm.entity.InventoryLog;
import com.aurum.crm.entity.Product;
import com.aurum.crm.exception.BadRequestException;
import com.aurum.crm.exception.ResourceNotFoundException;
import com.aurum.crm.mapper.InventoryMapper;
import com.aurum.crm.mapper.ProductMapper;
import com.aurum.crm.repository.InventoryLogRepository;
import com.aurum.crm.repository.ProductRepository;
import com.aurum.crm.service.InventoryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class InventoryServiceImpl implements InventoryService {

    private final InventoryLogRepository inventoryLogRepository;
    private final ProductRepository productRepository;
    private final int lowStockThreshold;

    public InventoryServiceImpl(InventoryLogRepository inventoryLogRepository,
                                ProductRepository productRepository,
                                @Value("${aurum.inventory.low-stock-threshold}") int lowStockThreshold) {
        this.inventoryLogRepository = inventoryLogRepository;
        this.productRepository = productRepository;
        this.lowStockThreshold = lowStockThreshold;
    }

    @Override
    public PageResponse<InventoryLogResponse> listLogs(Pageable pageable) {
        return PageResponse.from(
                inventoryLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                        .map(InventoryMapper::toResponse));
    }

    @Override
    @Transactional
    public InventoryLogResponse adjustStock(StockAdjustRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + request.productId()));
        int delta = request.change();
        if (product.getQuantity() + delta < 0) {
            throw new BadRequestException("Resulting stock cannot be negative");
        }
        InventoryLog log = applyMovement(product, delta, "ADMIN",
                request.note() != null ? request.note() : "Manual adjustment");
        return InventoryMapper.toResponse(log);
    }

    @Override
    public List<ProductResponse> lowStock() {
        return productRepository.findLowStock(lowStockThreshold).stream()
                .map(ProductMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public void recordMovement(Product product, int delta, String performedBy, String note) {
        applyMovement(product, delta, performedBy, note);
    }

    private InventoryLog applyMovement(Product product, int delta, String performedBy, String note) {
        int previous = product.getQuantity();
        int current = previous + delta;
        product.setQuantity(current);
        productRepository.save(product);

        InventoryLog log = InventoryLog.builder()
                .product(product)
                .previousQuantity(previous)
                .addedQuantity(delta > 0 ? delta : 0)
                .removedQuantity(delta < 0 ? -delta : 0)
                .currentQuantity(current)
                .performedBy(performedBy)
                .note(note)
                .build();
        return inventoryLogRepository.save(log);
    }
}
