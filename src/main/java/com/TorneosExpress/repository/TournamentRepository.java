package com.TorneosExpress.repository;

import com.TorneosExpress.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByCreatorId(Long creatorId);
    List<Tournament> findByName(String name);


    List<Tournament> findByisActiveTrue();

    List<Tournament> findByisPrivate(boolean privacy);


    List<Tournament> findBySport_SportName(String sportName);

    // Combine filters for privacy and sport name
    List<Tournament> findByisPrivateAndSport_SportName(boolean isPrivate, String sportName);
}
