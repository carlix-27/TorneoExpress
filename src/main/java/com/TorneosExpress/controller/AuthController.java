package com.TorneosExpress.controller;

import com.TorneosExpress.dto.LoginRequest;
import com.TorneosExpress.dto.RegisterRequest;
import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.dto.PlayerDto;
import com.TorneosExpress.response.LoginResponse;
import com.TorneosExpress.service.PlayerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PlayerService playerService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Player player = playerService.login(request.getEmail(), request.getPassword());
        if (player == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String sessionId = UUID.randomUUID().toString();
        Long userId = player.getId();

        LoginResponse response = new LoginResponse(
                new PlayerDto(
                        player.getId(),
                        player.getName(),
                        player.getLocation(),
                        player.getEmail(),
                        player.getIs_Premium(),
                        player.getEnabled(),
                        player.getPassword(),
                        player.getOwnedTeams(),
                        player.isIs_Captain()
                ),
                sessionId,
                userId
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/submit_registration")
    public ResponseEntity<PlayerDto> createPlayer(@RequestBody RegisterRequest request) {
        Player player = playerService.createPlayer(request.getName(), request.getLocation(), request.getEmail(), request.getPassword());
        PlayerDto playerDto = new PlayerDto(
                player.getId(),
                player.getName(),
                player.getEmail(),
                player.getLocation(),
                player.getIs_Premium(),
                player.getEnabled(),
                player.getPassword(),
                player.getOwnedTeams(),
                player.isIs_Captain()
        );
        return ResponseEntity.ok(playerDto);
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        request.getSession().invalidate(); // Invalidate the session
        return new ResponseEntity<>(HttpStatus.OK);
    }



}