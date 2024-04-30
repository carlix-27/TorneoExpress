package com.TorneosExpress.service;

import com.TorneosExpress.model.Tournament;
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

    public Tournament createTournament(String name, String location) { // Realizar la validación acá. Para evitar que la base de datos rompa.
        Tournament tournament = new Tournament();
        tournament.setName(name);
        tournament.setLocation(location);
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

}
