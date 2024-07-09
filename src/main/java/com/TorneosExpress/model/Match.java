package com.TorneosExpress.model;

import com.TorneosExpress.dto.ActiveMatch;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Optional;

@Entity
public class Match {
  private String teamName1;
  private String teamName2;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long matchId;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "team1_id", referencedColumnName = "id")
  private Team team1;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "team2_id", referencedColumnName = "id")
  private Team team2;


  @Column
  private Long tournament_id;

  @Column
  private String match_location;

  @Column
  private LocalDate date;

  @Column
  private String score;

  /*@OneToOne
  @JoinColumn(name = "statisticsId", nullable = false)
  private Statistics statistics;*/

  public Match(Team team1, Team team2, Long tournament_id, String match_location, LocalDate date, String score) {
    this.score = score;
    this.date = date;
    this.match_location = match_location;
    this.tournament_id = tournament_id;
    this.team2 = team2;
    this.team1 = team1;
    this.teamName1 = team1.getName();
    this.teamName2 = team2.getName();
  }


  @Override
  public String toString() {
    return teamName1 + " VS " + teamName2 + " on date " + date;
  }

  public Match() {}

  public String getTeamName1() {
    return teamName1;
  }

  public void setTeamName1(String teamName1) {
    this.teamName1 = teamName1;
  }

  public String getTeamName2() {
    return teamName2;
  }

  public void setTeamName2(String teamName2) {
    this.teamName2 = teamName2;
  }

  public Long getMatch_id() {
    return matchId;
  }

  public void setMatch_id(Long matchId) {
    this.matchId= matchId;
  }

  public Long getTeam1_id() {
    return team1.getId();
  }

  public void setTeam1_id(Long team1_id) {
    this.team1.setId(team1_id);
  }

  public Long getTeam2_id() {
    return team2.getId();
  }

  public void setTeam2_id(Long team2_id) {
    this.team2.setId(team2_id);
  }


  public Team getTeam1() {
    return team1;
  }

  public Team getTeam2() {
    return team2;
  }

  public void setTeam1(Team team1) {
    this.team1 = team1;
  }

  public void setTeam2(Team team2) {
    this.team2 = team2;
  }

  public Long getTournament_id() {
    return tournament_id;
  }

  public void setTournament_id(Long tournament_id) {
    this.tournament_id = tournament_id;
  }

  public String getMatch_location() {
    return match_location;
  }

  public void setMatch_location(String match_location) {
    this.match_location = match_location;
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

  // Statistics Data
  /*public Long getStatisticId(){ // Con este dato, al igual que con el resultado partido y ganador, voy a poder reconstruir la estadistica que quiero mostrar!
    return statistics.getId();
  }

  public void setStatisticId(Long statisticId){
    this.statistics.setId(statisticId);
  }

  public String getResultadoPartidoOfMatch(){
    return statistics.getResultadoPartido();
  }

  public String getGanadorOfMatch(){
    return statistics.getGanador();
  }*/

}
