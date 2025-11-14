package com.hospital.repository;

import com.hospital.entity.ERole;
import com.hospital.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    // ✅ KEY FIX: The method must accept an ERole enum, not a String
    Optional<Role> findByName(ERole name);
}