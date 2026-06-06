package com.aurum.crm.controller;

import com.aurum.crm.dto.request.StockAdjustRequest;
import com.aurum.crm.dto.response.ApiResponse;
import com.aurum.crm.dto.response.InventoryLogResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.ProductResponse;
import com.aurum.crm.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inventory")
public class AdminInventoryController {

    private final InventoryService inventoryService;

    public AdminInventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/logs")
    public ApiResponse<PageResponse<InventoryLogResponse>> logs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ApiResponse.ok(inventoryService.listLogs(PageRequest.of(page, size)));
    }

    @PostMapping("/adjust")
    public ApiResponse<InventoryLogResponse> adjust(@Valid @RequestBody StockAdjustRequest request) {
        return ApiResponse.ok("Stock adjusted", inventoryService.adjustStock(request));
    }

    @GetMapping("/low-stock")
    public ApiResponse<List<ProductResponse>> lowStock() {
        return ApiResponse.ok(inventoryService.lowStock());
    }
}
