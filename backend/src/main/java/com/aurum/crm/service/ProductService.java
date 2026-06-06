package com.aurum.crm.service;

import com.aurum.crm.dto.request.ProductRequest;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.ProductResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    PageResponse<ProductResponse> list(String search, Long categoryId, String status, Pageable pageable);
    ProductResponse get(Long id);
    ProductResponse create(ProductRequest request);
    ProductResponse update(Long id, ProductRequest request);
    void delete(Long id);
    List<ProductResponse> featured();
    List<ProductResponse> newArrivals();
    List<ProductResponse> bestSellers();
}
