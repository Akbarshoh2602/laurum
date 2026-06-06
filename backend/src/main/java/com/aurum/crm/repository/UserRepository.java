package com.aurum.crm.repository;

import com.aurum.crm.entity.Role;
import com.aurum.crm.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    @Query("""
            SELECT u FROM User u
            WHERE u.role = :role
              AND (:search IS NULL OR :search = ''
                   OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(u.lastName)  LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(u.email)     LIKE LOWER(CONCAT('%', :search, '%'))
                   OR u.phone            LIKE CONCAT('%', :search, '%'))
            """)
    Page<User> searchByRole(@Param("role") Role role,
                            @Param("search") String search,
                            Pageable pageable);
}
