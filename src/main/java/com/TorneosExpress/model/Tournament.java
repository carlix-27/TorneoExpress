package com.TorneosExpress.model;


import com.TorneosExpress.dto.tournament.CreateTournamentDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Getter
@Entity
@Setter
public class Tournament {

  public Tournament() {}

  public Tournament(String tournamentName, String tournamentLocation, Sport sport, boolean privacy, Difficulty difficulty, StageType type, Team winner) {
    this.name = tournamentName;
    this.location = tournamentLocation;
    this.sport = sport;
    this.isPrivate = privacy;
    this.difficulty = difficulty;
    this.isActive = true;
    this.type = type;
    this.winner = winner;
  }

  public Tournament(CreateTournamentDto request){
    this.creatorId = request.getCreatorId();
    this.name = request.getName();
    this.location = request.getLocation();
    this.sport = request.getSport();
    this.isPrivate = request.getIsPrivate();
    this.difficulty = request.getDifficulty();
    this.isActive = true;
    this.maxTeams = request.getMaxTeams();
    this.startDate = request.getDate();
    this.participatingTeams = new ArrayList<>();
    this.matches = new ArrayList<>();
    this.type = request.getType();
    this.winner = request.getWinner();
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long Id;

  @Column
  private Long creatorId;

  @Column(unique = true)
  private String name;

  @Column
  @Setter
  private String location;

  @Column
  private LocalDate startDate;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "sport_id", referencedColumnName = "sport_Id")
  private Sport sport;

  @Column
  private boolean isPrivate;

  @Column
  private Difficulty difficulty;

  @Column
  private boolean isActive;

  @Column
  private int maxTeams;

  @ManyToMany
  @JoinTable(
          name = "tournament_teams",
          joinColumns = @JoinColumn(name = "tournament_id"),
          inverseJoinColumns = @JoinColumn(name = "team_id"),
          uniqueConstraints = @UniqueConstraint(columnNames = { "tournament_id", "team_id" })
  )
  private List<Team> participatingTeams = new ArrayList<>();


  @OneToMany
  private List<Match> matches = new ArrayList<>();

  @ManyToOne
  @JoinColumn(name = "team_id") // Es null en primer instancia, luego debe setearse.
  private Team winner;


  @Column
  private StageType type;


}