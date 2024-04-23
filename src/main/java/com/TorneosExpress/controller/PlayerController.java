package com.TorneosExpress.controller;

import com.TorneosExpress.model.Player;
import com.TorneosExpress.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
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

    @GetMapping("/{userId}/premium")
    public ResponseEntity<Map<String, Boolean>> checkPremiumStatus(@PathVariable Long userId) {
        boolean isPremium = PlayerService.isPremiumUser(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isPremium", isPremium);
        return ResponseEntity.ok().body(response);
    }
}
