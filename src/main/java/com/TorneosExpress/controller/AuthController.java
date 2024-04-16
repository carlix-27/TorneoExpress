package com.TorneosExpress.controller;

import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.dto.PlayerDto;
import com.TorneosExpress.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PlayerService playerService;

    @PostMapping("/login")
    public ResponseEntity<PlayerDto> login(@RequestBody Player player) {
        Player loggedInPlayer = playerService.login(player.getEmail(), player.getPassword());
        if (loggedInPlayer == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        PlayerDto playerDto = new PlayerDto(
                loggedInPlayer.getId(),
                loggedInPlayer.getName(),
                loggedInPlayer.getEmail(),
                loggedInPlayer.isIs_premium(),
                loggedInPlayer.is(),
                loggedInPlayer.getPassword(),
                loggedInPlayer.getOwnedTeams(),
                loggedInPlayer.isCaptain()
        );
        return new ResponseEntity<>(playerDto, HttpStatus.OK);
    }
}