package com.TorneosExpress.repository;

import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByTournamentAndPlayed(Tournament tournament, boolean played);
}
