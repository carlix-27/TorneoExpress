package com.TorneosExpress.service;


import org.springframework.stereotype.Service;

@Service
public class RedirectService {
    public String getRedirectUrl(boolean loginSuccessful) {
        if (loginSuccessful) {
            // Redirect to a success page
            return "/Users/marcoshussey/Documents/Proyects/laboratorio-I/TorneosExpress/src/main/resources/static/home.html";
        } else {
            // Redirect to an error page
            return "/Users/marcoshussey/Documents/Proyects/laboratorio-I/TorneosExpress/src/main/resources/static/index.html";
        }
    }
}
