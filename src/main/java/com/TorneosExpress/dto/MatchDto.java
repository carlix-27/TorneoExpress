package com.TorneosExpress.dto;

import java.time.LocalDate;

public class MatchDto {
  private Long matchId;
  private Long team1_id;
  private Long team2_id;
  private String location;
  private LocalDate date;
  private String teamName1;

  public String getTeamName2() {
    return teamName2;
  }

  public void setTeamName2(String teamName2) {
    this.teamName2 = teamName2;
  }

  public String getTeamName1() {
    return teamName1;
  }

  public void setTeamName1(String teamName1) {
    this.teamName1 = teamName1;
  }

  private String teamName2;

  public Long getMatchId() {
    return matchId;
  }

  public void setMatchId(Long matchId) {
    this.matchId = matchId;
  }

  public Long getTeam1_id() {
    return team1_id;
  }

  public void setTeam1_id(Long team1_id) {
    this.team1_id = team1_id;
  }

  public Long getTeam2_id() {
    return team2_id;
  }

  public void setTeam2_id(Long team2_id) {
    this.team2_id = team2_id;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }
}
