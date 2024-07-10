package com.TorneosExpress.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {
    private String name;
    private String location;
    private String email;
    private String password;
}


