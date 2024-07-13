package com.TorneosExpress.service;

import com.TorneosExpress.dto.tournament.CreateTournamentDto;
import com.TorneosExpress.dto.tournament.SaveMatchStatsDto;
import com.TorneosExpress.dto.tournament.UpdateMatchDto;
import com.TorneosExpress.dto.tournament.UpdateTournamentDto;
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


    public List<Match> getAllMatches(Long tournamentId) {
        Tournament tournament = getTournamentById(tournamentId);
        return tournament.getMatches();
    }

    public List<Match> getTournamentFixture(Long tournamentId, Type type) {

        Tournament tournament = getTournamentById(tournamentId);
        List<Match> fixtureMatches;

        if (tournament.getMatches() == null || tournament.getMatches().isEmpty()) {
            List<Team> teams = tournament.getParticipatingTeams();
            teamRepository.saveAll(teams);

            teams = teamRepository.findAllById(teams.stream().map(Team::getId).collect(Collectors.toList()));

            fixtureMatches = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                .build(teams, type);

            tournament.setMatches(fixtureMatches);
            tournamentRepository.save(tournament);
        } else {
            fixtureMatches = tournament.getMatches();
        }

        return fixtureMatches;
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

    public Tournament endTournament(Long tournamentId, Long teamId) {
        Tournament tournament = getTournamentById(tournamentId);
        Team teamWinner = teamRepository.findById(teamId).orElse(null);
        Difficulty difficulty = tournament.getDifficulty();
        switch (difficulty){
            case BEGINNER:
                assert teamWinner != null;
                teamWinner.addPrestigePoints(10);
                break;
            case INTERMEDIATE:
                assert teamWinner != null;
                teamWinner.addPrestigePoints(30);
                break;
            case ADVANCED:
                assert teamWinner != null;
                teamWinner.addPrestigePoints(60);
                break;
            case EXPERT:
                assert teamWinner != null;
                teamWinner.addPrestigePoints(100);
                break;
        }
        tournament.setActive(false);
        return tournamentRepository.save(tournament);
    }

    public Match updateMatch(Long matchId, UpdateMatchDto newMatch) {

        Match match = matchRepository.findById(matchId).orElse(null);

        Team newMatchFirstTeam = newMatch.getTeam1();
        Team newMatchSecondTeam = newMatch.getTeam2();
        String newLocation = newMatch.getLocation();
        LocalDate newDate = newMatch.getDate();

        assert match != null;
        match.setTeam1(newMatchFirstTeam);
        match.setTeam2(newMatchSecondTeam);
        match.setMatchLocation(newLocation);
        match.setDate(newDate);
        match.setPlayed(true);

        return matchRepository.save(match);
    }

    public Match updateMatchStats(Long matchId, SaveMatchStatsDto statsDto) {

        Match match = getMatchById(matchId);

        int team1score = statsDto.getTeam1Score();
        int team2score = statsDto.getTeam2Score();
        Long winnerId = statsDto.getWinner();

        match.setFirstTeamScore(team1score);
        match.setSecondTeamScore(team2score);
        match.setWinner(winnerId);
        match.setPlayed(true);

        return matchRepository.save(match);
    }

    public Tournament getTournamentById(Long id) {
        Optional<Tournament> optionalTournament = tournamentRepository.findById(id);
        return optionalTournament.orElse(null);
    }

}
