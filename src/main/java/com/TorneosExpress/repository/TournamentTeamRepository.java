package com.TorneosExpress.repository;

import com.TorneosExpress.model.TournamentTeam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentTeamRepository extends JpaRepository<TournamentTeam, Long> {
}
