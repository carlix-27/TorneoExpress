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
  private boolean isPrivate;

  @Column
  private Difficulty difficulty;

  public Tournament() { }

  public Tournament(Long creatorId, String tournamentName, String tournamentLocation, Sport tournamentSport, boolean privacy, Difficulty difficulty) {
    this.name = tournamentName;
    this.location = tournamentLocation;
    this.sport = tournamentSport.toString();
    this.isPrivate = privacy;
    this.difficulty = difficulty;
  }

  public void setTournament_id(Long tournamentId) {
    this.Id = tournamentId;
  }

  public Difficulty getDifficulty() { return this.difficulty; }

  public Long getCreatorId() {
    return creatorId;
  }

  @ManyToMany
  private List<Team> participatingTeams = new ArrayList<>();

  @OneToMany
  private List<Team> participationRequests = new ArrayList<>(20);


  public void joinTournament(Team team) {
    if (!isPrivate) {
      participatingTeams.add(team);
    } else {
      requestParticipation(team);
    }
  }

  private void requestParticipation(Team team) {
    this.participationRequests.add(team);
  }

  public void acceptTeam(Team team) {
    participatingTeams.add(team);
    participationRequests.remove(team);
  }

  public void rejectTeam(Team team) {
    participationRequests.remove(team);
  }

  public void leave(Team team) {
    participatingTeams.remove(team);
  }

}
