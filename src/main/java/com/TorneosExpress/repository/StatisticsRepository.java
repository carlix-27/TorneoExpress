package com.TorneosExpress.repository;

import com.TorneosExpress.model.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
    Statistics findByMatch_matchId(Long matchId);
    Optional<Statistics> findByMatch_matchIdAndTournament_Id(Long matchId, Long tournamentId);
}
