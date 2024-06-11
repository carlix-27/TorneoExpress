package com.TorneosExpress.repository;

import com.TorneosExpress.model.TournamentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TournamentRequestRepository extends JpaRepository<TournamentRequest, Long> {
    List<TournamentRequest> findByrequestTo(Long requestTo);
    List<TournamentRequest> findByRequestToAndTeamId(Long toId, Long teamId);
}
