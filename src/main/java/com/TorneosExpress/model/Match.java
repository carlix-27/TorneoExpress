package com.TorneosExpress.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Match {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long matchId;

  @ManyToOne
  @JoinColumn(name = "team1_id", nullable = false)
  private Team team1;

  @ManyToOne
  @JoinColumn(name = "team2_id", nullable = false)
  private Team team2;

  @ManyToOne
  @JoinColumn(name = "tournament_id", nullable = false)
  private Tournament tournament;

  @Column
  private String matchLocation;

  @Column
  private LocalDate date;

  @Column
  private String score;

  @Column
  private boolean played;

  public Match() {}

  public Match(Team team1, Team team2, Tournament tournament, String matchLocation, LocalDate date, String score) {
    this.team1 = team1;
    this.team2 = team2;
    this.tournament = tournament;
    this.matchLocation = matchLocation;
    this.date = date;
    this.score = score;
    this.played = false;
  }

  // Getters and setters...

  public Long getMatchId() {
    return matchId;
  }

  public void setMatchId(Long matchId) {
    this.matchId = matchId;
  }

  public Team getTeam1() {
    return team1;
  }

  public void setTeam1(Team team1) {
    this.team1 = team1;
  }

  public Team getTeam2() {
    return team2;
  }

  public void setTeam2(Team team2) {
    this.team2 = team2;
  }

  public Tournament getTournament() {
    return tournament;
  }

  public void setTournament(Tournament tournament) {
    this.tournament = tournament;
  }

  public String getMatchLocation() {
    return matchLocation;
  }

  public void setMatchLocation(String matchLocation) {
    this.matchLocation = matchLocation;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public String getScore() {
    return score;
  }

  public void setScore(String score) {
    this.score = score;
  }

  public boolean isPlayed() {
    return played;
  }

  public void setPlayed(boolean played) {
    this.played = played;
  }
}
