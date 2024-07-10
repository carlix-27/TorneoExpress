package com.TorneosExpress.model;

import jakarta.persistence.*;

@Entity
public class TournamentTeamArticle {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "team_id")
  private Team team;

  @ManyToOne
  @JoinColumn(name = "tournament_id")
  private Tournament tournament;

  @ManyToOne
  @JoinColumn(name = "article_id")
  private Article article;

  public TournamentTeamArticle() {

  }


}
