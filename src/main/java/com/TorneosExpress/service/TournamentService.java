package com.TorneosExpress.service;

import com.TorneosExpress.fixture.Fixture;
import com.TorneosExpress.fixture.FixtureBuilder;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    @Autowired
    public TournamentService(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    public Fixture getTournamentCalendar(Long tournamentId) {
        Tournament tournament = getTournamentById(tournamentId);
        Fixture fixture = new FixtureBuilder(
            tournamentId, tournament.getLocation(), tournament.getStartDate())
            .build(tournament.getParticipatingTeams());
        return fixture;
    }

    public List<Tournament> getTournamentsByUser(Long userId) {
        return tournamentRepository.findByCreatorId(userId);
    }

    public Tournament createTournament(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }

    public boolean isTournamentNameUnique(String name) {
        return tournamentRepository.findByName(name).isEmpty();
    }

    public Tournament getTournamentById(Long id) {
        Optional<Tournament> optionalTournament = tournamentRepository.findById(id);
        return optionalTournament.orElse(null);
    }
    public Tournament updateTournament(Tournament tournament) {
        if (tournament.getId() == null || !tournamentRepository.existsById(tournament.getId())) {
            return null;
        }
        return tournamentRepository.save(tournament);
    }

    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }

    public List<Tournament> getActiveTournaments() {
        return tournamentRepository.findByisActiveTrue();
    }

}
