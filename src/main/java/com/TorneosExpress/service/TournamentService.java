package com.TorneosExpress.service;

import com.TorneosExpress.fixture.Fixture;
import com.TorneosExpress.fixture.FixtureBuilder;
import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.repository.MatchRepository;
import com.TorneosExpress.repository.TeamRepository;
import com.TorneosExpress.repository.TournamentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;

    @Autowired
    public TournamentService(TournamentRepository tournamentRepository, TeamRepository teamRepository, MatchRepository matchRepository) {
        this.tournamentRepository = tournamentRepository;
        this.teamRepository = teamRepository;
        this.matchRepository = matchRepository;
    }

    public List<Team> getTeamsOfTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));
        return tournament.getParticipatingTeams();
    }


    public List<Match> getActiveMatches(Long tournamentId){

        Tournament tournament = getTournamentById(tournamentId);
        if(tournament == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found");
        }

        return matchRepository.findByTournamentAndPlayed(tournament, false);
    }

    @Transactional
    public Fixture getTournamentCalendar(Long tournamentId) {
        Tournament tournament = getTournamentById(tournamentId);
        Fixture fixture;


        if (tournament.getFixture() == null || tournament.getFixture().getMatches().isEmpty()) {
            List<Team> teams = tournament.getParticipatingTeams();
            teamRepository.saveAll(teams);

            teams = teamRepository.findAllById(teams.stream().map(Team::getId).collect(Collectors.toList()));

            fixture = new FixtureBuilder(
                tournamentId, tournament.getLocation(), tournament.getStartDate(), matchRepository)
                .build(teams);

            tournament.setFixture(fixture);
            tournamentRepository.save(tournament);
        } else {
            fixture = tournament.getFixture();
        }

        return fixture;
    }


    public List<Tournament> getTournamentsByUser(Long userId) {
        return tournamentRepository.findByCreatorIdOrParticipatingTeamsUserId(userId);
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

    public Match getMatchById(Long id) {
        return matchRepository.getReferenceById(id);
    }

    public Match updateMatch(Match match) {
        return matchRepository.save(match);
    }

    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }

    public List<Tournament> getActiveTournaments() {
        return tournamentRepository.findByisActiveTrue();
    }

    public List<Tournament> getInactiveTournaments(){
        return tournamentRepository.findByisActiveFalse();
    }

    public Tournament addTeamToTournament(Long teamId, Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));

        List<Team> participatingTeams = tournament.getParticipatingTeams();
        if (participatingTeams.contains(team)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team is already participating in the tournament.");
        }

        if (participatingTeams.size() >= tournament.getMaxTeams()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tournament is full.");
        }

        participatingTeams.add(team);
        return tournamentRepository.save(tournament);
    }


}
