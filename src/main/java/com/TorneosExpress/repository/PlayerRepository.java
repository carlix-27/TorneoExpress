
package com.TorneosExpress.repository;

import com.TorneosExpress.model.User;
import com.TorneosExpress.model.player.Player;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PlayerRepository extends JpaRepository<Player, Long>{
}
