
package com.TorneosExpress.repository;

import com.TorneosExpress.model.player.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface PlayerRepository extends JpaRepository<Player, Long>{
    @Query("SELECT p FROM Player p WHERE p.player_email = ?1")
    Player findByPlayerEmail(String player_email);
}

