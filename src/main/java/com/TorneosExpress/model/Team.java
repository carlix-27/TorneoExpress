package com.TorneosExpress.model;

import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.model.shop.Article;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Team {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  private String name;

  @Column
  private String location;

  @Column
  private boolean isPrivate;

  @Column
  private int prestigePoints;

  @Column
  private Long captainId;

  @ManyToMany
  private List<Player> players = new ArrayList<>();

  @ManyToMany
  private List<Article> articles = new ArrayList<>();

  @ManyToMany
  private List<Tournament> ActiveTournaments = new ArrayList<>();

  @OneToMany
  private List<Player> joinRequests = new ArrayList<>(20);

  public Team(String teamName, String teamLocation, boolean privacy, Long captainId) {
    this.name = teamName;
    this.location = teamLocation;
    this.isPrivate = privacy;
    this.prestigePoints = 0;
  }

  public Team() { }

  /* GETTERS */

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public int getPrestigePoints() {
    return prestigePoints;
  }

  public String getLocation() {
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

  public Long getCaptain() {
    return this.captainId;
  }

  /* END OF GETTERS */



}
