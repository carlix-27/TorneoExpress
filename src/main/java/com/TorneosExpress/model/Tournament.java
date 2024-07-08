package com.TorneosExpress.model;


import com.TorneosExpress.dto.ShortTournamentDto;
import com.TorneosExpress.dto.tournament.TournamentDto;
import com.TorneosExpress.fixture.Fixture;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
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
    this.fixture = dto.getFixture();
  }

  public Tournament(String tournamentName, String tournamentLocation, Sport sport, boolean privacy, Difficulty difficulty) {
    this.name = tournamentName;
    this.location = tournamentLocation;
    this.sport = sport;
    this.isPrivate = privacy;
    this.difficulty = difficulty;
    this.isActive = true;
    this.fixture = null;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long Id;

  @Column
  private Long creatorId;

  @Column(unique = true)
  private String name;

  @Column
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

  @Embedded
  private Fixture fixture;

  public boolean isActive() {
    return isActive;
  }

  public void setActive(boolean active) {
    isActive = active;
  }

  public int getMaxTeams() {
    return maxTeams;
  }

  public void setMaxTeams(int maxTeams) {
    this.maxTeams = maxTeams;
  }

  public void setCreatorId(Long creatorId) {
    this.creatorId = creatorId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public Sport getSport() {
    return sport;
  }

  public void setSport(Sport sport) {
    this.sport = sport;
  }

  public boolean isPrivate() {
    return isPrivate;
  }

  public void setPrivate(boolean aPrivate) {
    isPrivate = aPrivate;
  }

  public void setDifficulty(Difficulty difficulty) {
    this.difficulty = difficulty;
  }

  public void setFixture(Fixture fixture) {
    this.fixture = fixture;
  }

  @Override
  public boolean equals(Object o){ // Define bien como tiene que comparar contains con las colecciones de java.
    if (this == o) return true;
    if (!(o instanceof Tournament)) {
      return false;
    }
    Tournament other = (Tournament) o;
    return this.getId().equals(other.getId());
  }

  public List<Team> getParticipatingTeams() {
    return participatingTeams;
  }

  public Fixture getFixture() {
    return fixture;
  }

  public void setParticipatingTeams(List<Team> participatingTeams) {
    this.participatingTeams = participatingTeams;
  }

  public Long getId() {
    return Id;
  }

  public void setId(Long id) {
    Id = id;
  }

  public void setTournament_id(Long tournamentId) {
    this.Id = tournamentId;
  }

  public Difficulty getDifficulty() { return this.difficulty; }

  public Long getCreatorId() {
    return creatorId;
  }

  public ShortTournamentDto toShortDto(){
    return new ShortTournamentDto(this.Id, this.name);
  }

}
