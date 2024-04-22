package com.TorneosExpress.service;

import com.TorneosExpress.model.Team;
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

  public Team save(Team team) {
    return teamRepository.save(team);
  }

  public Team createTeam(Team team) {
    return save(team);
  }

}
