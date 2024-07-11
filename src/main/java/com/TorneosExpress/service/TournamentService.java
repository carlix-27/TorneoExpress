package com.TorneosExpress.service;

import com.TorneosExpress.dto.tournament.CreateTournamentDto;
import com.TorneosExpress.dto.tournament.UpdateMatchDto;
import com.TorneosExpress.dto.tournament.UpdateTournamentDto;
import com.TorneosExpress.fixture.Fixture;
import com.TorneosExpress.fixture.FixtureBuilder;
import com.TorneosExpress.model.*;
import com.TorneosExpress.repository.MatchRepository;
import com.TorneosExpress.repository.TeamRepository;
import com.TorneosExpress.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
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
        Tournament tournament = getTournamentById(tournamentId);
        return tournament.getParticipatingTeams();
    }


    public List<Match> getActiveMatches(Long tournamentId){
        Tournament tournament = getTournamentById(tournamentId);
        return matchRepository.findByTournamentAndPlayed(tournament, false);
    }

    public Fixture getTournamentFixture(Long tournamentId) {

        Tournament tournament = getTournamentById(tournamentId);
        Fixture fixture;

        if (tournament.getFixture() == null || tournament.getFixture().getMatches().isEmpty()) {
            List<Team> teams = tournament.getParticipatingTeams();
            teamRepository.saveAll(teams);

            teams = teamRepository.findAllById(teams.stream().map(Team::getId).collect(Collectors.toList()));

            fixture = new FixtureBuilder(
                tournament, tournament.getLocation(), tournament.getStartDate(), matchRepository)
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

    public Tournament createTournament(CreateTournamentDto createTournamentDto) {
        Tournament tournament = new Tournament(createTournamentDto);
        return tournamentRepository.save(tournament);
    }

    public List<Tournament> getTournamentsByTeam(Long teamId) {
        return tournamentRepository.findTournamentsByTeamId(teamId);
    }


    public Tournament updateTournament(Long tournamentId, UpdateTournamentDto updateTournamentDto) {
        Tournament tournament = getTournamentById(tournamentId);
        Tournament updatedTournament = updateTournamentData(tournament, updateTournamentDto);
        return tournamentRepository.save(updatedTournament);
    }

    private Tournament updateTournamentData(Tournament existingTournament, UpdateTournamentDto updateTournamentDto) {

        String updatedTournamentName = updateTournamentDto.getName();
        String updatedTournamentLocation = updateTournamentDto.getLocation();
        Boolean updatedTournamentPrivate = updateTournamentDto.getIsPrivate();
        Difficulty updatedTournamentDifficulty = updateTournamentDto.getDifficulty();

        existingTournament.setName(updatedTournamentName);
        existingTournament.setLocation(updatedTournamentLocation);
        existingTournament.setPrivate(updatedTournamentPrivate);
        existingTournament.setDifficulty(updatedTournamentDifficulty);
        return existingTournament;
    }

    public Match getMatchById(Long id) {
        return matchRepository.getReferenceById(id);
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

    public Tournament endTournament(Long tournamentId) {
        Tournament tournament = getTournamentById(tournamentId);
        tournament.setActive(false);
        return tournamentRepository.save(tournament);
    }

    public Match updateMatch(Long matchId, UpdateMatchDto newMatch) {

        Team newMatchFirstTeam = newMatch.getTeam1();
        Team newMatchSecondTeam = newMatch.getTeam2();
        String newLocation = newMatch.getLocation();
        LocalDate newDate = newMatch.getDate();

        Match match = matchRepository.findById(matchId).orElse(null);

        assert match != null;
        match.setTeam1(newMatchFirstTeam);
        match.setTeam2(newMatchSecondTeam);
        match.setMatchLocation(newLocation);
        match.setDate(newDate);

        return matchRepository.save(match);
    }

    public Tournament getTournamentById(Long id) {
        Optional<Tournament> optionalTournament = tournamentRepository.findById(id);
        return optionalTournament.orElse(null);
    }

}
