package com.TorneosExpress.service;

import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

  @Autowired
  private TeamRepository teamRepository;

  public Team findById(long id) {
    return teamRepository.findById(id);
  }

  public List<Team> findByCaptainId(long id) {
    return teamRepository.findByCaptainId(id);
  }

  public List<Team> findByName(String name) {
    return teamRepository.findByName(name);
  }

  public List<Team> findAll() {
    return teamRepository.findAll();
  }

  public void deleteTeamById(long id) {
    teamRepository.deleteById(id);
  }

  public Team updateTeam(Team team) {
    // Check if the tournament with given ID exists
    if (team.getId() == null || !teamRepository.existsById(team.getId())) {
      return null; // Tournament not found
    }
    return teamRepository.save(team);
  }

  public Team save(Team team) {
    return teamRepository.save(team);
  }

  public Team createTeam(Team team) {
    return save(team);
  }

}
