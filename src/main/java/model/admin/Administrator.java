package model.admin;

import model.Difficulty;
import model.Sport;
import model.Team;
import model.Tournament;

import javax.persistence.*;
import java.util.NoSuchElementException;

public class Administrator {

    @PersistenceContext
    private EntityManager entityManager;

    public Administrator(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    @Id
    private long admin_id;

    @Column
    private String admin_mail;

    @Column
    private String admin_name;

    private SportManager sportManager = new SportManager(entityManager);

    private TournamentManager tournamentManager = new TournamentManager();

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
