package com.TorneosExpress.repository;

import com.TorneosExpress.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByCreatorId(Long creatorId);
    Tournament findByName(String name);
}
