package com.TorneosExpress.repository;

import com.TorneosExpress.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByName(String name);

    List<Tournament> findByisActiveTrue();

    List<Tournament> findByisActiveFalse();

    @Query("SELECT DISTINCT t FROM Tournament t " +
            "LEFT JOIN t.participatingTeams pt " +
            "LEFT JOIN pt.players p " +
            "WHERE t.creatorId = :userId OR p.id = :userId")
    List<Tournament> findByCreatorIdOrParticipatingTeamsUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Tournament t JOIN t.participatingTeams pt WHERE pt.id = :teamId")
    List<Tournament> findTournamentsByTeamId(@Param("teamId") Long teamId);


}

