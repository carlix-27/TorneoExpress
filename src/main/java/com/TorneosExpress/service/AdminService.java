package com.TorneosExpress.service;

import com.TorneosExpress.model.User;
import com.TorneosExpress.model.admin.AdminLoginInformation;
import com.TorneosExpress.repository.AdminRepository;
import com.TorneosExpress.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<AdminLoginInformation> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<AdminLoginInformation> getAdminById(Long id) {
        return adminRepository.findById(id);
    }
}
