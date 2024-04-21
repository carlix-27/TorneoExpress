package com.TorneosExpress.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Tournament {
  @Id
  private Long Id;

  public void setCreatorId(Long creatorId) {
    this.creatorId = creatorId;
  }

  @Column
  private Long creatorId;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getSport() {
    return sport;
  }

  public void setSport(String sport) {
    this.sport = sport;
  }

  public boolean isPrivate() {
    return isPrivate;
  }

  public void setPrivate(boolean aPrivate) {
    isPrivate = aPrivate;
  }

  public void setDifficulty(Difficulty difficulty) {
    this.difficulty = difficulty;
  }

  public List<Team> getParticipatingTeams() {
    return participatingTeams;
  }

  public void setParticipatingTeams(List<Team> participatingTeams) {
    this.participatingTeams = participatingTeams;
  }

  public List<Team> getParticipationRequests() {
    return participationRequests;
  }

  public void setParticipationRequests(List<Team> participationRequests) {
    this.participationRequests = participationRequests;
  }

  public Long getId() {
    return Id;
  }

  public void setId(Long id) {
    Id = id;
  }

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

}
