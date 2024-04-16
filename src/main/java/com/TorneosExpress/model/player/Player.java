package com.TorneosExpress.model.player;


import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Player {
    public Player(String playerName, String playerLocation, String playerEmail, String password) {
        this.name = playerName;
        this.location = playerLocation;
        this.email = playerEmail;
        this.password = password;
        this.is_premium = false;
        this.is_captain = false;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String name;

    @Column
    private String location;

    @Column
    private String email;

    @Column(name = "is_captain")
    private boolean is_captain;

    @Column(name = "is_premium")
    private boolean is_premium;

    @Column(name = "password")
    private String password;

    @ManyToMany
    private List<Team> ownedTeams = new ArrayList<>();


    public Player() {}

    public void setPlayer_name(String name2){
        name = name2;
    }

    public void setPlayer_location(String location2){
        location = location2;
    }

    public void setPlayer_email(String email2){
        email = email2;
    }

    public void setPassword(String password1){
        password = password1;
    }

    public String getPassword(){
        return password;
    }

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

    public void rejectPlayer(Player player, Team team) {
        if (isOwnerOf(team)) {
            team.rejectPlayer(player);
        }
    }

    // Para mas adelante: Si un usuario quiere, puede pagar para crear un torneo.
    public void createTournament() {

    }

    public void joinTournament(Team team, Tournament tournament) {
        // equivale a ser capitan.
        if (isOwnerOf(team)) {
            team.joinTournament(tournament);
        }
    }

    private boolean isOwnerOf(Team team) {
        return team.getCaptain().equals(this);
    }

    public String getEmail(){
        return email;
    }

}
