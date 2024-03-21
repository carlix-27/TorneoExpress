package org.example.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Tournament {
  @Id
  private Long tournament_id;

  @Column
  private Long creator_id;

  @Column
  private String tournament_name;

  @Column
  private String tournament_location;

  @Column
  private String tournament_sport;

  @Column
  private Difficulty difficulty;

  @Column
  private String rewards;

  public void setTournament_id(Long tournamentId) {
    this.tournament_id = tournamentId;
  }

  @ManyToMany
  private List<Team> participatingTeams = new ArrayList<>();

  public void joinTournament(Team team) {
    participatingTeams.add(team);
  }

  public void leave(Team team) {
    participatingTeams.remove(team);
  }

}
