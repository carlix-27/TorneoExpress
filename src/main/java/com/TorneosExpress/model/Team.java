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
  private Long teamId;

  @Column
  private String teamName;

  @Column
  private String teamLocation;

  @Column
  private boolean isPrivate;

  @Column
  private int prestigePoints;

  @ManyToOne
  private Player captain;

  @ManyToMany
  private List<Player> players = new ArrayList<>();

  public List<Player> getPlayers(){
    return players;
  }

  @ManyToMany
  private List<Article> articles = new ArrayList<>();

  @ManyToMany
  private List<Tournament> ActiveTournaments = new ArrayList<>();

  @OneToMany
  private List<Player> joinRequests = new ArrayList<>(20);

  public Team(String teamName, String teamLocation, boolean privacy, Player captain) {
    this.teamName = teamName;
    this.teamLocation = teamLocation;
    this.isPrivate = privacy;
    this.captain = captain;
    this.prestigePoints = 0;
  }

  public Team() { }





}
