package com.TorneosExpress.service;

import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;


    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player createPlayer(String player_name, String player_location, String player_email, String password) {
        Player newPlayer = new Player();
        newPlayer.setPlayer_name(player_name);
        newPlayer.setPlayer_location(player_location);
        newPlayer.setPlayer_email(player_email);
        newPlayer.setPassword(password);
        return savePlayer(newPlayer);
    }
}