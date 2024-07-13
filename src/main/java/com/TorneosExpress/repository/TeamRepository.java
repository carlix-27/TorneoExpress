package com.TorneosExpress.repository;

import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.TournamentTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
  Team findById(long id);

  List<Team> findByCaptainId(Long captainId);

  List<Team> findByName(String name);

  @Query("SELECT t FROM Team t JOIN t.players p WHERE p.id = :userId")
  List<Team> findByMemberId(@Param("userId") Long userId);


  @Query("SELECT t FROM Tournament tr " +
          "JOIN tr.participatingTeams t " +
          "WHERE tr.Id = :tournamentId AND t.id = :teamId")
  TournamentTeam findByTournamentIdAndTeamId(@Param("tournamentId") Long tournamentId, @Param("teamId") Long teamId);
}
