package com.aurum.crm.security;

import com.aurum.crm.entity.Role;

/**
 * Lightweight principal extracted from the JWT and stored in the SecurityContext.
 * userId is -1 for the synthetic ADMIN123 account.
 */
public record AuthPrincipal(Long userId, String subject, Role role) {
    public boolean isPersistedUser() {
        return userId != null && userId > 0;
    }
}
