package com.aurum.crm.mapper;

import com.aurum.crm.dto.response.UserResponse;
import com.aurum.crm.entity.User;

public final class UserMapper {
    private UserMapper() {}

    public static UserResponse toResponse(User u) {
        return new UserResponse(
                u.getId(),
                u.getFirstName(),
                u.getLastName(),
                u.getEmail(),
                u.getPhone(),
                u.getAddress(),
                u.getRole().name(),
                u.isActive(),
                u.getCreatedAt()
        );
    }
}
