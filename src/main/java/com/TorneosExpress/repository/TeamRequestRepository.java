package com.TorneosExpress.repository;

import com.TorneosExpress.model.TeamRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRequestRepository extends JpaRepository<TeamRequest, Long> {
    List<TeamRequest> findByRequestTo(Long requestTo);
    List<TeamRequest> findByRequestToAndTeamId(Long toId, Long teamId);
}
