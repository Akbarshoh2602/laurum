package com.aurum.crm.service;

import com.aurum.crm.dto.request.CategoryRequest;
import com.aurum.crm.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> list();
    CategoryResponse get(Long id);
    CategoryResponse create(CategoryRequest request);
    CategoryResponse update(Long id, CategoryRequest request);
    void delete(Long id);
}
