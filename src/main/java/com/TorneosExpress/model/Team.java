package com.TorneosExpress.model;
import com.TorneosExpress.dto.ShortTeamDto;
import com.TorneosExpress.dto.ShortTournamentDto;
import com.TorneosExpress.dto.team.TeamDto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Team {

  public Team(TeamDto teamDto) {
    this.id = teamDto.getId();
    this.name = teamDto.getName();
    this.location = teamDto.getLocation();
    this.isPrivate = teamDto.isPrivate();
    this.prestigePoints = teamDto.getPrestigePoints();
    this.captainId = teamDto.getCaptainId();
    this.sport = teamDto.getSport();
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String name;

  @Column
  private String location;

  @Column
  private boolean isPrivate;

  @Column
  private int prestigePoints;

  @Column
  private Long captainId;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "sport_id", referencedColumnName = "sport_Id")
  private Sport sport;

  @ManyToMany(mappedBy = "participatingTeams")
  @JsonIgnore
  private List<Tournament> activeTournaments = new ArrayList<>();


  @ManyToMany
  @JoinTable(
          name = "team_players",
          joinColumns = @JoinColumn(name = "team_id"),
          inverseJoinColumns = @JoinColumn(name = "players_id")
  )
  private List<Player> players = new ArrayList<>();

  @ManyToMany
  @JoinTable(
          name = "team_articles",
          joinColumns = @JoinColumn(name = "team_id"),
          inverseJoinColumns = @JoinColumn(name = "articles_article_id")
  )
  private List<Article> articles = new ArrayList<>();


  public Team(Long captainId, String teamName, Sport sport, String teamLocation, boolean isPrivate) {
    this.name = teamName;
    this.location = teamLocation;
    this.sport = sport;
    this.isPrivate = isPrivate;
    this.prestigePoints = 0;
    this.captainId = captainId;
  }

  public Team(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return name;
  }

  public Team() {
  }

  // Getters and setters...

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getLocation() {
    return location;
  }

  public boolean isPrivate() {
    return isPrivate;
  }

  public int getPrestigePoints() {
    return prestigePoints;
  }

  public Long getCaptainId() {
    return captainId;
  }

  public List<Tournament> getActiveTournaments() {
    return activeTournaments;
  }

  public List<Player> getPlayers() {
    return players;
  }


  public List<Article> getArticles() {
    return articles;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public void setIsPrivate(boolean aPrivate) {
    isPrivate = aPrivate;
  }

  public void setPrestigePoints(int prestigePoints) {
    this.prestigePoints = prestigePoints;
  }

  public void setCaptainId(Long captainId) {
    this.captainId = captainId;
  }

  public void setActiveTournaments(List<Tournament> activeTournaments) {
    this.activeTournaments = activeTournaments;
  }

  public void setPlayers(List<Player> players) {
    this.players = players;
  }

  public void addPlayer(Player player) {
    this.players.add(player);
  }

  public void setJoinRequests(List<Player> players) {
    this.players = players;
  }

  public void setArticles(List<Article> articles) {
    this.articles = articles;
  }

  public Sport getSport() {
    return sport;
  }

  public void setSport(Sport sport) {
    this.sport = sport;
  }

  public ShortTeamDto shortTeamDto(){
    return new ShortTeamDto(this.id, this.name);
  }
}
