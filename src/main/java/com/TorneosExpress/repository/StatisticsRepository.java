package com.TorneosExpress.repository;

import com.TorneosExpress.model.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
    List<Statistics> findByTournamentId(Long tournamentId);
}
