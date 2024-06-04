package com.TorneosExpress.model.Match;

import com.TorneosExpress.model.Team;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Match {
  private String teamName1;
  private String teamName2;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long match_id;

  @Column
  private Long team1_id;

  @Column
  private Long team2_id;

  @Column
  private Long tournament_id;

  @Column
  private String match_location;

  @Column
  private LocalDate date;

  @Column
  private String score;

  public Match(Team team1, Team team2, Long tournament_id, String match_location, LocalDate date, String score) {
    this.score = score;
    this.date = date;
    this.match_location = match_location;
    this.tournament_id = tournament_id;
    this.team2_id = team2.getId();
    this.team1_id = team1.getId();
    this.teamName1 = team1.getName();
    this.teamName2 = team2.getName();
  }

  @Override
  public String toString() {
    return teamName1 + " VS " + teamName2 + " on date " + date;
  }

  public Match() {}

  public void setMatch_id(Long matchId) {
    this.match_id = matchId;
  }

  public Long getMatch_id() {
    return match_id;
  }

  public Long getTeam1_id() {
    return team1_id;
  }

  public Long getTeam2_id() {
    return team2_id;
  }
}
