package com.TorneosExpress.model.player;


import com.TorneosExpress.model.PlayerType;
import com.TorneosExpress.model.Privacy;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    @Column
    private PlayerType playerType;

    @ManyToMany
    private List<Team> ownedTeams = new ArrayList<>();

    private boolean isCaptain;

    public Player(String playerName, String playerLocation, String playerEmail) {
        this.player_name = playerName;
        this.player_location = playerLocation;
        this.player_email = playerEmail;
        this.playerType = PlayerType.REGULAR_PLAYER;
        this.isCaptain = false;
    }

    public Player() {  }

    public void joinTeam(Team team) {
      team.join(this);
    }

    public void createTeam(String teamName, String teamLocation, Privacy privacy) {
        Team team = new Team(teamName, teamLocation, privacy, this);
        this.ownedTeams.add(team);
    }

    public void eliminateTeam(Team team) {
        if (checkOwnership(team)) {
            team = null;
        }
    }

    public void acceptPlayer() {

    }

    public void createTournament() {

    }

    public void joinTournament(Team team, Tournament tournament) {
        if (checkOwnership(team)) {
            team.joinTournament(tournament);
        }
    }

    private boolean checkOwnership(Team team) {
        return this.ownedTeams.contains(team);
    }

}
