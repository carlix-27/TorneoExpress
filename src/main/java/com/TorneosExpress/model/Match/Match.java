package com.TorneosExpress.model.Match;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Match {
  @Id
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

  public void setMatch_id(Long matchId) {
    this.match_id = matchId;
  }

  public Long getMatch_id() {
    return match_id;
  }
}
