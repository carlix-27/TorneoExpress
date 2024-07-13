package com.TorneosExpress.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiKeyController {

    @Value("${api.key}")
    private String apiKey;

    @GetMapping("/api/googleMapsApiKey")
    public String getApiKey() {
        return apiKey;
    }
}
