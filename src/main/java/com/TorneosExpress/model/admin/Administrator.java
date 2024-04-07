package com.TorneosExpress.model.admin;

import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import jakarta.persistence.Entity;

import jakarta.persistence.*;


@Entity
public class Administrator {


    @Id
    private long admin_id;

    @Column
    private String admin_mail;

    @Column
    private String admin_name;

    private SportManager sportManager = new SportManager(entityManager);

    private TournamentManager tournamentManager = new TournamentManager();

    public Administrator() {

    }

    public void createTournament(String tournamentName, String tournamentLocation, Sport tournamentSport, Difficulty difficulty) {
        tournamentManager.createTournament(this.admin_id, tournamentName, tournamentLocation, tournamentSport, difficulty);
    }

    public void deleteTournament(Tournament tournament) {
        tournamentManager.deleteTournament(tournament);
    }

    public void updateTournament() {

    }

    public void updateRanking() {

    }

    public void assignWinner(Tournament tournament, Team team) {
        tournamentManager.assignWinner(tournament, team);
    }

    public void createSport(String sportName, int numPlayers){
        sportManager.createSport(sportName, numPlayers);
    }

    public void deleteSport(long sportId){
        sportManager.deleteSport(sportId);
    }

    public void updateSport(long sportId, String newSportName, int newNumPlayers){
        sportManager.updateSport(sportId, newSportName, newNumPlayers);
    }

}
