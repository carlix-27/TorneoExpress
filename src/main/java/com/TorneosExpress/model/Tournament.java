package com.TorneosExpress.model;


import com.TorneosExpress.dto.tournament.TournamentDto;
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

  public Tournament() { }

  public Tournament(TournamentDto dto){
    this.Id = dto.getId();
    this.creatorId = dto.getCreatorId();
    this.name = dto.getName();
    this.location = dto.getLocation();
    this.startDate = dto.getStartDate();
    this.sport = dto.getSport();
    this.isPrivate = dto.getIsPrivate();
    this.difficulty = dto.getDifficulty();
    this.isActive = dto.getIsActive();
    this.maxTeams = dto.getMaxTeams();
  }

  public Tournament(String tournamentName, String tournamentLocation, Sport sport, boolean privacy, Difficulty difficulty) {
    this.name = tournamentName;
    this.location = tournamentLocation;
    this.sport = sport;
    this.isPrivate = privacy;
    this.difficulty = difficulty;
    this.isActive = true;
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
  @JsonIgnore
  @Setter
  private List<Match> matches = new ArrayList<>();

  @Override
  public boolean equals(Object o){ // Define bien como tiene que comparar contains con las colecciones de java.
    if (this == o) return true;
    if (!(o instanceof Tournament other)) {
      return false;
    }
    return this.getId().equals(other.getId());
  }

}
