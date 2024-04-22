package com.TorneosExpress.model;

import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.model.shop.Article;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Team {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Long id;

  @Column
  private String name;

  @Column
  private String location;

  @Column
  private boolean isPrivate;

  @Column
  private int prestigePoints;

  @ManyToOne
  private Player captain;

  @ManyToMany
  private List<Player> players = new ArrayList<>();

  @ManyToMany
  private List<Article> articles = new ArrayList<>();

  @ManyToMany
  private List<Tournament> ActiveTournaments = new ArrayList<>();

  @OneToMany
  private List<Player> joinRequests = new ArrayList<>(20);

  public Team(String teamName, String teamLocation, boolean privacy, Player captain) {
    this.name = teamName;
    this.location = teamLocation;
    this.isPrivate = privacy;
    this.captain = captain;
    this.prestigePoints = 0;
  }

  public Team() { }

  /* GETTERS */

  public Long getTeamId() {
    return id;
  }

  public String getTeamName() {
    return name;
  }

  public int getPrestigePoints() {
    return prestigePoints;
  }

  public String getTeamLocation() {
    return location;
  }

  public boolean isPrivate() {
    return isPrivate;
  }

  public List<Article> getArticles() {
    return articles;
  }

  public List<Player> getJoinRequests() {
    return joinRequests;
  }

  public List<Player> getPlayers(){
    return players;
  }

  public List<Tournament> getActiveTournaments() {
    return ActiveTournaments;
  }

  public Player getCaptain() {
    return this.captain;
  }

  /* END OF GETTERS */



}
