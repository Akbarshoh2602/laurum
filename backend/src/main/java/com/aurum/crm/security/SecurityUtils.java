package com.aurum.crm.security;

import com.aurum.crm.exception.BadRequestException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static AuthPrincipal currentPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthPrincipal principal)) {
            throw new BadRequestException("Not authenticated");
        }
        return principal;
    }

    public static Long currentUserId() {
        AuthPrincipal p = currentPrincipal();
        if (!p.isPersistedUser()) {
            throw new BadRequestException("This action requires a registered customer account");
        }
        return p.userId();
    }
}
