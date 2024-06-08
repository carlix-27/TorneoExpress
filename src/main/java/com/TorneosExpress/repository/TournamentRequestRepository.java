package com.TorneosExpress.repository;

import com.TorneosExpress.model.TournamentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentRequestRepository extends JpaRepository<TournamentRequest, Long> {
}
