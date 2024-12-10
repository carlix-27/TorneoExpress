
package com.TorneosExpress.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
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

  @Column
  private String matchLocation;

  @Column
  private LocalDate date;

  @Column
  private Long winner;

  @Column
  private boolean played;

  @Column
  private int firstTeamScore;

  @Column
  private int secondTeamScore;




  public Match() {}

  public Match(Team team1, Team team2, String matchLocation, LocalDate date, Long winner) {
    this.team1 = team1;
    this.team2 = team2;
    this.matchLocation = matchLocation;
    this.date = date;
    this.winner = winner;
    this.played = false;
  }

}
