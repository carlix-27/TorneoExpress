package com.TorneosExpress.repository;

import com.TorneosExpress.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {
    Match findMatchByMatch_id(Long match_id);
}
