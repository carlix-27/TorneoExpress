package com.TorneosExpress.controller;

import com.TorneosExpress.dto.auth.LoginRequest;
import com.TorneosExpress.dto.auth.RegisterRequest;
import com.TorneosExpress.model.Player;
import com.TorneosExpress.service.PlayerService;
import com.TorneosExpress.security.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    private final PlayerService playerService;

    @Autowired
    public AuthController(PlayerService playerService, JwtUtil jwtUtil) {
        this.playerService = playerService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public String  login(@RequestBody LoginRequest request) {

        String requestEmail = request.email();
        String requestPassword = request.password();

        Player player = playerService.login(requestEmail, requestPassword);

        if (player == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String token = jwtUtil.generateToken(request.getUsername());
        return token;
    }


    @PostMapping("/submit_registration")
    public Player createPlayer(@RequestBody RegisterRequest request) {
        return playerService.createPlayer(request.getName(), request.getLocation(), request.getEmail(), request.getPassword());
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return new ResponseEntity<>(HttpStatus.OK);
    }



}