package com.TorneosExpress.controller;


import com.TorneosExpress.model.admin.AdminLoginInformation;
import com.TorneosExpress.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/admins")
    public List<AdminLoginInformation> getAdmins() {
        return adminService.getAllAdmins();
    }
}