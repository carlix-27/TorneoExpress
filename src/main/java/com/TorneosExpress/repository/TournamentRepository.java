package com.TorneosExpress.repository;

import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.model.Sport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByCreatorId(Long creatorId);
    List<Tournament> findByName(String name);
    List<Tournament> findByIsActiveTrue();
    List<Tournament> findByIsPrivate(boolean isPrivate);
    List<Tournament> findBySport_SportName(String sportName);
    List<Tournament> findByIsPrivateAndSport_SportName(boolean isPrivate, String sportName);
    List<Tournament> findByIsPrivateAndDifficulty(boolean isPrivate, Difficulty difficulty);
}
