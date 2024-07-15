package com.TorneosExpress.controller;
import com.TorneosExpress.dto.team.CreateTeamDto;
import com.TorneosExpress.model.Article;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
  public ResponseEntity<Team> createTeam(@RequestBody CreateTeamDto teamRequest) {

    Team team = new Team(teamRequest);

    Team createdTeam = teamService.createTeam(team);
    Long createdTeamId = createdTeam.getId();

    teamService.addPlayerToTeam(createdTeamId, teamRequest.getCaptainId());
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
  public ResponseEntity<Map<String, List<Team>>> getTeamsByUser(@PathVariable Long userId) {
    List<Team> teamsAsCaptain = teamService.findByCaptainId(userId);
    List<Team> teamsAsMember = teamService.findByMemberId(userId);
    teamsAsMember.removeAll(teamsAsCaptain); // Remove duplicate teams

    Map<String, List<Team>> response = new HashMap<>();
    response.put("teamsAsCaptain", teamsAsCaptain);
    response.put("teamsAsMember", teamsAsMember);

    return ResponseEntity.ok().body(response);
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

  // Store LOGIC
  @GetMapping("/myArticles/{teamId}")
  public List<Article> getMyArticles(@PathVariable Long teamId) {
      return teamService.getMyArticles(teamId);
  }




}
