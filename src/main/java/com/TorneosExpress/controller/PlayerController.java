package com.TorneosExpress.controller;

import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class PlayerController {

    @Autowired
    private PlayerService PlayerService;

    @GetMapping("/players/{id}")
    public Optional<Player> getPlayerById(@PathVariable Long id) {
        return PlayerService.getPlayerById(id);
    }


    @PostMapping("/submit_registration")
    public Player createPlayer(@RequestBody Player player){
        return PlayerService.savePlayer(player);
    }


    }
