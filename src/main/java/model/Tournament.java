package model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Tournament {
  @Id
  private Long tournamentId;

  @Column
  private Long creatorId;

  @Column
  private String tournamentName;

  @Column
  private String tournamentLocation;

  @Column
  private String tournamentSport;

  @Column
  private Difficulty difficulty;

  public Tournament() { }

  public Tournament(Long creatorId, String tournamentName, String tournamentLocation, Sport tournamentSport, Difficulty difficulty) {
    this.tournamentName = tournamentName;
    this.tournamentLocation = tournamentLocation;
    this.tournamentSport = tournamentSport.toString();
    this.difficulty = difficulty;
  }

  public void setTournament_id(Long tournamentId) {
    this.tournamentId = tournamentId;
  }

  public Difficulty getDifficulty() { return this.difficulty; }

  @ManyToMany
  private List<Team> participatingTeams = new ArrayList<>();

  public void joinTournament(Team team) {
    participatingTeams.add(team);
  }

  public void leave(Team team) {
    participatingTeams.remove(team);
  }

}
