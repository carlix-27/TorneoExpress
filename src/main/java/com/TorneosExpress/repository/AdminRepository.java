package com.TorneosExpress.repository;

import com.TorneosExpress.model.admin.AdminLoginInformation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<AdminLoginInformation, Long> {
}
