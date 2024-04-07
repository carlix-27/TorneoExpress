package com.TorneosExpress.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Tournament {
  @Id
  private Long Id;

  @Column
  private Long creatorId;

  @Column
  private String name;

  @Column
  private String location;

  @Column
  private String sport;

  @Column
  private Difficulty difficulty;

  public Tournament() { }

  public Tournament(Long creatorId, String tournamentName, String tournamentLocation, Sport tournamentSport, Difficulty difficulty) {
    this.name = tournamentName;
    this.location = tournamentLocation;
    this.sport = tournamentSport.toString();
    this.difficulty = difficulty;
  }

  public void setTournament_id(Long tournamentId) {
    this.Id = tournamentId;
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
