
package com.TorneosExpress.repository;

import com.TorneosExpress.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PlayerRepository extends JpaRepository<Player, Long>{
    Player findByemail(String player_email);
    Player findById(long id);
    List<Player> findByName(String name);
}

