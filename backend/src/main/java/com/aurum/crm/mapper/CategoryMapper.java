package com.aurum.crm.mapper;

import com.aurum.crm.dto.response.CategoryResponse;
import com.aurum.crm.entity.Category;

public final class CategoryMapper {
    private CategoryMapper() {}

    public static CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription());
    }
}
