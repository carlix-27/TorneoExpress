package com.TorneosExpress.controller;

import com.TorneosExpress.dto.LoginRequest;
import com.TorneosExpress.dto.RegisterRequest;
import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.dto.PlayerDto;
import com.TorneosExpress.response.LoginResponse;
import com.TorneosExpress.service.PlayerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
    public ResponseEntity<LoginResponse> login(HttpServletRequest request, @RequestBody LoginRequest loginRequest) {
        Player player = playerService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (player == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Generate a session ID
        String sessionId = UUID.randomUUID().toString();

        // Store the userId and sessionId in request attributes
        request.setAttribute("userId", player.getId());
        request.setAttribute("sessionId", sessionId);

        // Create a response with the player data and sessionId
        LoginResponse response = new LoginResponse(
                new PlayerDto(
                        player.getId(),
                        player.getName(),
                        player.getLocation(),
                        player.getEmail(),
                        player.isIs_premium(),
                        player.getEnabled(),
                        player.getPassword(),
                        player.getOwnedTeams(),
                        player.isIs_captain()
                ),
                sessionId
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
                player.isIs_premium(),
                player.getEnabled(),
                player.getPassword(),
                player.getOwnedTeams(),
                player.isIs_captain()
        );
        return ResponseEntity.ok(playerDto);
    }



}