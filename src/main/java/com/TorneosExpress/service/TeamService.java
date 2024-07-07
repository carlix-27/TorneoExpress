package com.TorneosExpress.service;

import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.repository.PlayerRepository;
import com.TorneosExpress.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

  private final TeamRepository teamRepository;
  private final PlayerRepository playerRepository;

  @Autowired
  public TeamService(TeamRepository teamRepository, PlayerRepository playerRepository) {
    this.teamRepository = teamRepository;
    this.playerRepository = playerRepository;
  }

  public Team findById(long id) {
    return teamRepository.findById(id);
  }


  public Team addPlayerToTeam(Long teamId, Long userId) {
    Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));

    Player player = playerRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    List<Player> players = team.getPlayers();
    boolean playerIsInTeam = players.contains(player);

    if (playerIsInTeam) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Player is already part of the team.");
    }

    int teamMaxPlayers = team.getMaxPlayers();
    if (players.size() == teamMaxPlayers){
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Numero máximo de jugadores en el equipo");
    }

    players.add(player);
    return teamRepository.save(team);
  }

  public List<Team> findByCaptainId(long id) {
    return teamRepository.findByCaptainId(id);
  }

  public List<Team> findByName(String name) {
    return teamRepository.findByName(name);
  }

  public void deleteTeamById(long id) {
    teamRepository.deleteById(id);
  }

  public Team save(Team team) {
    return teamRepository.save(team);
  }

  public Team createTeam(Team team) {
    return save(team);
  }

  public List<Team> getAllTeams() {
    return teamRepository.findAll();
  }

  public List<Player> getPlayersOfTeam(Long teamId) {
    Optional<Team> team = teamRepository.findById(teamId);
    if (team.isPresent()) {
      return team.get().getPlayers();
    } else {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
  }

  public Team removePlayerFromTeam(Long teamId, Long userId) {
    Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new  ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    Player player = playerRepository.findById(userId)
            .orElseThrow(() -> new  ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    List<Player> players = team.getPlayers();
    boolean canRemovePlayer = players.remove(player);

    if (canRemovePlayer) {
      player.getTeams().remove(team);
      playerRepository.save(player);
      teamRepository.save(team);
    } else {
      throw new IllegalArgumentException("Player is not a member of the team");
    }

    return team;
  }

}
