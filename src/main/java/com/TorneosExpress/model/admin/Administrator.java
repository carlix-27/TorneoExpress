package com.TorneosExpress.model.admin;

import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import jakarta.persistence.Entity;

import jakarta.persistence.*;

import java.util.NoSuchElementException;


@Entity
public class Administrator {


    @Id
    private long admin_id;

    @Column
    private String admin_mail;

    @Column
    private String admin_name;


    public Administrator() {

    }

    public void createTournament(String tournamentName, String tournamentLocation, Sport tournamentSport, Difficulty difficulty) {
        Tournament tournament = new Tournament(admin_id, tournamentName, tournamentLocation, tournamentSport, difficulty);
    }

    public void deleteTournament(Tournament tournament) {
        tournament = null;
    }

    public void updateTournament() {

    }

    public void updateRanking() {

    }

    public void assignWinner(Tournament tournament, Team team) {
        this.giveRewards(team, tournament.getDifficulty());
    }

    private void giveRewards(Team team, Difficulty difficulty) {
        final int prestigePoints = prestigePointsAccordingToDifficulty(difficulty);
        team.addPrestigePoints(prestigePoints);
    }

    private int prestigePointsAccordingToDifficulty(Difficulty difficulty) {
        int prestigePoints;
        if (difficulty.equals(Difficulty.BEGINNER)) prestigePoints = 5;
        else if (difficulty.equals(Difficulty.INTERMIDIATE)) prestigePoints = 10;
        else if (difficulty.equals(Difficulty.ADVANCED)) prestigePoints = 20;
        else prestigePoints = 50;
        return prestigePoints;
    }
    

}
