package org.example.model;

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

  @Column
  private String rewards;

  public Tournament() { }

  public Tournament(Long creatorId, String tournamentName, String tournamentLocation, String tournamentSport, Difficulty difficulty, String rewards) {
    this.tournamentName = tournamentName;
    this.tournamentLocation = tournamentLocation;
    this.tournamentSport = tournamentSport;
    this.difficulty = difficulty;
    this.rewards = rewards;
  }

  public void setTournament_id(Long tournamentId) {
    this.tournamentId = tournamentId;
  }

  @ManyToMany
  private List<Team> participatingTeams = new ArrayList<>();

  public void joinTournament(Team team) {
    participatingTeams.add(team);
  }

  public void leave(Team team) {
    participatingTeams.remove(team);
  }

}
