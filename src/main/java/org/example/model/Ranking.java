package org.example.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import java.util.ArrayList;
import java.util.List;

public class Ranking {

  private Long tournament_id;

  private Long team_id;

  private Long updater_id;

  private int team_points;

  @ManyToOne
  private List<Team> ranking = new ArrayList<>();

  public List<Team> rankingOf() {
    return ranking;
  }

  public void updateRanking() {

  }


}
