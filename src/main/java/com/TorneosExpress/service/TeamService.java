package com.TorneosExpress.service;

import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TeamService {

  @Autowired
  private TeamRepository teamRepository;

  public Optional<Team> findById(long id) {
    return teamRepository.findById(id);
  }

  public Team saveTeam(Team team) {
    return teamRepository.save(team);
  }

  public Team createTeam(String teamName, String location, boolean isPrivate, Player captain) {
    Team team = new Team(teamName, location, isPrivate, captain);
    return saveTeam(team);
  }

}
