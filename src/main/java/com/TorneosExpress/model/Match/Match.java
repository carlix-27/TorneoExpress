package com.TorneosExpress.model.Match;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Match {

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
  private Date date;

  @Column
  private String score;

  public Match(Long team1_id, Long team2_id, Long tournament_id, String match_location, Date date, String score) {
    this.score = score;
    this.date = date;
    this.match_location = match_location;
    this.tournament_id = tournament_id;
    this.team2_id = team2_id;
    this.team1_id = team1_id;
  }

  /* Auxiliary constructor for FixtureBuilder. */
  public Match(Long team1Id, Long team2Id) {

  }

  public Match() {}

  public void setMatch_id(Long matchId) {
    this.match_id = matchId;
  }

  public Long getMatch_id() {
    return match_id;
  }
}
