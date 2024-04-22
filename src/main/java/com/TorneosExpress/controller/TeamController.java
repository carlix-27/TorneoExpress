package com.TorneosExpress.controller;

import com.TorneosExpress.dto.CreateTeamRequest;
import com.TorneosExpress.dto.TeamDto;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/createTeam")
public class TeamController {

  @Autowired
  TeamService teamService;

  @Autowired
  public TeamController(TeamService teamService) {
    this.teamService = teamService;
  }

  @PostMapping("/submit_creation")
  public ResponseEntity<TeamDto> createTeam(@RequestBody CreateTeamRequest teamRequest) {
    Team team = teamService.createTeam(teamRequest.getTeamName(),
        teamRequest.getLocation(),
        teamRequest.isPrivate(),
        teamRequest.getCaptain());

    TeamDto teamDto = new TeamDto(
        team.getTeamId(),
        team.getTeamName(),
        team.getTeamLocation(),
        team.isPrivate(),
        team.getPrestigePoints(),
        team.getCaptain(),
        team.getPlayers(),
        team.getArticles(),
        team.getJoinRequests(),
        team.getActiveTournaments()
    );
    return ResponseEntity.ok(teamDto);
  }
}
