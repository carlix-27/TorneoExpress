package com.TorneosExpress.model;


import com.TorneosExpress.dto.tournament.CreateTournamentDto;
import com.TorneosExpress.fixture.Fixture;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

  public Tournament(String tournamentName, String tournamentLocation, Sport sport, boolean privacy, Difficulty difficulty, Type type) {
    this.name = tournamentName;
    this.location = tournamentLocation;
    this.sport = sport;
    this.isPrivate = privacy;
    this.difficulty = difficulty;
    this.isActive = true;
    this.type = type;
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
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long Id;

  @Column
  @Setter
  private Long creatorId;

  @Column(unique = true)
  @Setter
  private String name;

  @Column
  @Setter
  private String location;

  @Column
  @Setter
  private LocalDate startDate;

  @ManyToOne(fetch = FetchType.EAGER)
  @Setter
  @JoinColumn(name = "sport_id", referencedColumnName = "sport_Id")
  private Sport sport;

  @Column
  @Setter
  private boolean isPrivate;

  @Column
  @Setter
  private Difficulty difficulty;

  @Setter
  @Column
  private boolean isActive;

  @Setter
  @Column
  private int maxTeams;

  @ManyToMany
  @Setter
  @JoinTable(
          name = "tournament_teams",
          joinColumns = @JoinColumn(name = "tournament_id"),
          inverseJoinColumns = @JoinColumn(name = "team_id"),
          uniqueConstraints = @UniqueConstraint(columnNames = { "tournament_id", "team_id" })
  )
  private List<Team> participatingTeams = new ArrayList<>();


  @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
  @Setter
  private List<Match> matches = new ArrayList<>();


  @Column
  private Type type;

}