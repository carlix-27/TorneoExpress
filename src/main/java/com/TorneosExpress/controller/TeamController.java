package com.TorneosExpress.controller;
import com.TorneosExpress.dto.team.TeamDto;
import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.service.PlayerService;
import com.TorneosExpress.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

  private final TeamService teamService;

  private final PlayerService playerService;

  @Autowired
  public TeamController(TeamService teamService, PlayerService playerService) {
    this.teamService = teamService;
    this.playerService = playerService;
  }

  @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Team> createTeam(@RequestBody TeamDto teamRequest) {
    Team createdTeam = teamService.createTeam(new Team(teamRequest));
    teamService.addPlayerToTeam(createdTeam.getId(), teamRequest.getCaptainId());
    playerService.upgradeToCaptain(teamRequest.getCaptainId());
    return new ResponseEntity<>(createdTeam, HttpStatus.CREATED);
  }

  @PostMapping("/add/{teamId}/{userId}")
  public ResponseEntity<Team> addPlayerToTeam(@PathVariable Long teamId, @PathVariable Long userId) {
    try {
      Team team = teamService.addPlayerToTeam(teamId, userId);
      return new ResponseEntity<>(team, HttpStatus.CREATED);
    } catch (ResponseStatusException ex) {
      return ResponseEntity.status(500).body(null);
    }
  }


  @GetMapping("/user/{userId}")
  public ResponseEntity<List<Team>> getTeamsByUser(@PathVariable Long userId) {
    List<Team> teams = teamService.findByCaptainId(userId);
    return ResponseEntity.ok().body(teams);
  }

  @GetMapping("/all")
  public List<Team> getAllTeams() {
    return teamService.getAllTeams();
  }

  @GetMapping("/allTeams")
  public List<Team> getTeams() {
    return teamService.getAllTeams();
  }

  @GetMapping("/findByName/{name}")
  public ResponseEntity<List<Team>> getTeamsByName(@PathVariable String name) {
    List<Team> teams = teamService.findByName(name);
    return ResponseEntity.ok().body(teams);
  }

  @DeleteMapping("/{teamId}")
  public ResponseEntity<String> deleteTournament(@PathVariable Long teamId) {
    teamService.deleteTeamById(teamId);
    return ResponseEntity.ok("Team deleted successfully");
  }

  @GetMapping("/{teamId}")
  public ResponseEntity<Team> getTeamById(@PathVariable Long teamId) {
    Team team = teamService.findById(teamId);
    if (team == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(team);
  }

  @GetMapping("/captain/{userId}")
  public List<Team> getTeamsByCaptainId(@PathVariable Long userId) {
    return teamService.findByCaptainId(userId);
  }

  @GetMapping("/all/{teamId}")
  public List<Player> getPlayersOfTeam(@PathVariable Long teamId){
    return teamService.getPlayersOfTeam(teamId);
  }

  @DeleteMapping("{teamId}/{userId}")
  public Team deletePlayerFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
    return teamService.removePlayerFromTeam(teamId, userId);
  }



}
