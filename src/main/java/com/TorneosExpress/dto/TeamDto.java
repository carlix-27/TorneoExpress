package com.TorneosExpress.dto;

import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.shop.Article;

import java.util.List;

public class TeamDto {
  private Long id;
  private String teamName;
  private String location;
  private boolean isPrivate;
  private int prestigePoints;
  private Player captain;
  private List<Player> players;
  private List<Tournament> tournaments;
  private List<Article> articles;
  private List<Player> joinRequests;

  public TeamDto(Long id, String teamName, String location, boolean isPrivate, int prestigePoints, Player captain, List<Player> players, List<Article> articles, List<Player> joinRequests, List<Tournament> tournaments) {
    this.id = id;
    this.teamName = teamName;
    this.location = location;
    this.isPrivate = isPrivate;
    this.prestigePoints = prestigePoints;
    this.captain = captain;
    this.players = players;
    this.tournaments = tournaments;
    this.articles = articles;
    this.joinRequests = joinRequests;
  }

  public Long getId() {
    return id;
  }

  public String getTeamName() {
    return teamName;
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

  public Player getCaptain() {
    return captain;
  }

  public List<Article> getArticles() {
    return articles;
  }

  public List<Player> getJoinRequests() {
    return joinRequests;
  }

  public List<Player> getPlayers() {
    return players;
  }

  public List<Tournament> getTournaments() {
    return tournaments;
  }
}
