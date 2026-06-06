package com.aurum.crm.controller;

import com.aurum.crm.dto.response.ApiResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.ProductResponse;
import com.aurum.crm.service.ProductService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false, defaultValue = "ACTIVE") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return ApiResponse.ok(productService.list(search, categoryId, status, PageRequest.of(page, size, sort)));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(productService.get(id));
    }

    @GetMapping("/featured")
    public ApiResponse<List<ProductResponse>> featured() {
        return ApiResponse.ok(productService.featured());
    }

    @GetMapping("/new-arrivals")
    public ApiResponse<List<ProductResponse>> newArrivals() {
        return ApiResponse.ok(productService.newArrivals());
    }

    @GetMapping("/best-sellers")
    public ApiResponse<List<ProductResponse>> bestSellers() {
        return ApiResponse.ok(productService.bestSellers());
    }
}
