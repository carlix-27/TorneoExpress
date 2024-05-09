package com.TorneosExpress.service;

import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.repository.PlayerRepository;
import com.TorneosExpress.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TournamentService {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private PlayerRepository playerRepository;


    public List<Tournament> getTournamentsByUser(Long userId) {
        return tournamentRepository.findByCreatorId(userId);
    }

    public Tournament createTournament(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }

    public boolean isTournamentNameUnique(String name) {
        return tournamentRepository.findByName(name).isEmpty();
    }

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    public Tournament getTournamentById(Long id) {
        Optional<Tournament> optionalTournament = tournamentRepository.findById(id);
        return optionalTournament.orElse(null);
    }

    public List<Tournament> findByName(String name) {
        return tournamentRepository.findByName(name);
    }

    public Tournament updateTournament(Tournament tournament) {
        // Check if the tournament with given ID exists
        if (tournament.getId() == null || !tournamentRepository.existsById(tournament.getId())) {
            return null; // Tournament not found
        }
        return tournamentRepository.save(tournament);
    }

    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }


    public List<Tournament> getActiveTournaments() {
        return tournamentRepository.findByIsActiveTrue();
    }

    public List<Tournament> findByPrivacy(boolean isPrivate) {
        return tournamentRepository.findByIsPrivate(isPrivate);
    }

    public List<Tournament> findBySport(String sportName) {
        return tournamentRepository.findBySport_SportName(sportName);
    }

    public List<Tournament> findByPrivacyAndSport(boolean isPrivate, String sportName) {
        return tournamentRepository.findByIsPrivateAndSport_SportName(isPrivate, sportName);
    }

    public List<Tournament> findByPrivacyAndSportAndType(boolean isPrivate, String name, Sport sport, String type) {
        return tournamentRepository.findByIsPrivateAndSport_SportNameAndType(isPrivate, name, sport.getSportName(), type);
    }

    public List<Tournament> findByPrivacyAndType(boolean isPrivate, String type) {
        return tournamentRepository.findByIsPrivateAndType(isPrivate, type);
    }

    public List<Tournament> findByPrivacyAndSport(boolean isPrivate, String name, Sport sport) {
        return tournamentRepository.findByIsPrivateAndSport_SportName(isPrivate, name, sport.getSportName());
    }

    public List<Tournament> findBySportAndType(Sport sport, String name, String type) {
        return tournamentRepository.findBySport_SportNameAndType(sport.getSportName(), name, type);
    }

    public List<Tournament> findBySport(String name, Sport sport) {
        return tournamentRepository.findBySport_SportName(name, sport.getSportName());
    }

    public List<Tournament> findByType(String name, String type) {
        return tournamentRepository.findByType(name, type);
    }


}
