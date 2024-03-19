package org.example.model.player;


import org.example.model.Team;

import javax.persistence.*;

@Entity
public class Player {
    @Id
    private Long player_id;

    @Column
    private String player_name;

    @Column
    private String player_location;

    @Column (nullable = false, unique = true)
    private String player_email;

    public void joinTeam(Team team) {
      team.join(this);
    }

    public void createTeam() {

    }

    public void createTournamnet() {

    }

}
