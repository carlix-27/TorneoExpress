package com.TorneosExpress.model.player;


import com.TorneosExpress.model.PlayerType;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;

import jakarta.persistence.*;
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

    public void createTeam(String teamName, String teamLocation, boolean privacy) {
        Team team = new Team(teamName, teamLocation, privacy, this);
        this.ownedTeams.add(team);
    }

    public void eliminateTeam(Team team) {
        if (isOwnerOf(team)) {
            team = null;
        }
    }

    public void acceptPlayer(Player player, Team team) {
        if (isOwnerOf(team)) {
            team.acceptPlayer(player);
        }
    }

    // Para mas adelante: Si un usuario quiere, puede pagar para crear un torneo.
    public void createTournament() {

    }

    public void joinTournament(Team team, Tournament tournament) {
        if (isOwnerOf(team)) {
            team.joinTournament(tournament);
        }
    }

    private boolean isOwnerOf(Team team) {
        return team.getCaptain().equals(this);
    }

}
