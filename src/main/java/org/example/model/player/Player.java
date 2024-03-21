package org.example.model.player;


import org.example.model.Role;
import org.example.model.Team;
import org.example.model.User;

import javax.persistence.*;

@Entity
@DiscriminatorValue("PLAYER")
public class Player extends User {
    public Player() {

    }

    public Player(String name, String email, String password){
        super(name, email, password, Role.PLAYER);
    }

    public void joinTeam(Team team) {
      team.join(this);
    }

    public void createTeam() {

    }


    // Como los administradores van a estar precargados en la db, no es necesario que el jugador tenga esta función.
    /*
    public void createTournament() {

    }*/

}
