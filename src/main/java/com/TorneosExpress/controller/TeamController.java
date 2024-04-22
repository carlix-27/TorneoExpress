package com.TorneosExpress.controller;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.service.TeamService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

  @Autowired
  TeamService teamService;

  @PostMapping("/create")
  public ResponseEntity<Team> createTeam(@RequestBody Team team, HttpServletRequest request) {
    Team createdTeam = teamService.createTeam(team);
    return new ResponseEntity<>(createdTeam, HttpStatus.CREATED);
  }
}
