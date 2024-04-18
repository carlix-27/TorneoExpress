package com.TorneosExpress.controller;

import com.TorneosExpress.dto.LoginRequest;
import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.dto.PlayerDto;
import com.TorneosExpress.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PlayerService playerService;

    @PostMapping("/login")
    public ResponseEntity<PlayerDto> login(@RequestBody LoginRequest request) {
        Player player = playerService.login(request.getEmail(), request.getPassword());
        if (player == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
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
        return new ResponseEntity<>(playerDto, HttpStatus.OK);
    }



}