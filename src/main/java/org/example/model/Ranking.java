package org.example.model;

import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import java.util.*;

public class Ranking {

  private Long tournamentId;

  //private Long teamId;

  private Long updaterId;

  //private int teamPoints;

  @ManyToOne
  private List<Team> ranking = new ArrayList<>();

  @OneToOne
  private Map<Team, Integer> teamPoints = new HashMap<>();

  public List<Team> rankingOf() {
    return ranking;
  }

  public void updateRanking(Team team, Integer newPoints) {
    int currentPoints = teamPoints.get(team);
    // Update value.
    teamPoints.put(team, currentPoints + newPoints);
  }

}
