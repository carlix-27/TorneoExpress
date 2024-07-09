package com.TorneosExpress.repository;

import com.TorneosExpress.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByTournamentIdAndPlayed(Long tournamentId, boolean played);
    List<Match> findByTournamentId(Long tournamentId);
}
