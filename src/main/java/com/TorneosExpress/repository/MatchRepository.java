package com.TorneosExpress.repository;

import com.TorneosExpress.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findAllByTournamentId(Long tournament_id);
}
