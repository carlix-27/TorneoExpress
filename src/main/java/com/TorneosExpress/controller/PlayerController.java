package com.TorneosExpress.controller;

import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class PlayerController {

    @Autowired
    private PlayerService PlayerService;


    @Autowired
    public PlayerController(PlayerService playerService) {
        this.PlayerService = playerService;
    }

    @GetMapping("/players/{id}")
    public Optional<Player> getPlayerById(@PathVariable Long id) {
        return PlayerService.getPlayerById(id);
    }


    @PostMapping("/submit_registration")
    public ResponseEntity<Player> createPlayer(@RequestParam String player_name,
                                               @RequestParam String player_location,
                                               @RequestParam String player_email,
                                               @RequestParam String password) {
        Player newPlayer = PlayerService.createPlayer(player_name, player_location, player_email, password);
        return ResponseEntity.ok(newPlayer);
    }


//    @PostMapping("/submit_login")
//    public String login(@RequestParam String email, @RequestParam String password) {
//        Player player = new Player();
//        player.setPlayer_email(email);
//        player.setPassword(password);
//        return PlayerService.login(player);
//    }


}
