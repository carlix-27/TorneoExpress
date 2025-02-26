package com.TorneosExpress.model;
import com.TorneosExpress.dto.team.CreateTeamDto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Team {

  public Team(CreateTeamDto createTeamDto) {
    this.name = createTeamDto.getName();
    this.location = createTeamDto.getLocation();
    this.isPrivate = createTeamDto.isPrivate();
    this.prestigePoints = 0;
    this.captainId = createTeamDto.getCaptainId();
    this.sport = createTeamDto.getSport();
    this.tournamentsWon = new ArrayList<>();
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String name;

  @Column
  private String location;

  @Column
  private Boolean isPrivate;

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

  @OneToMany(mappedBy = "winner")
  @JsonIgnore
  private List<Tournament> tournamentsWon = new ArrayList<>();


  public void addTournamentsWon(Tournament tournament){
    tournamentsWon.add(tournament);
  }

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

  public Team(Long captainId, String teamName, Sport sport, String teamLocation, boolean isPrivate, List<Tournament> tournamentWon) {
    this.name = teamName;
    this.location = teamLocation;
    this.sport = sport;
    this.isPrivate = isPrivate;
    this.prestigePoints = 0;
    this.captainId = captainId;
    this.tournamentsWon = tournamentWon;
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

  public void addPrestigePoints(int points) {
    this.prestigePoints += points;
  }

  public void setPrivate(Boolean isPrivate) {
    this.isPrivate = isPrivate;
  }
}
