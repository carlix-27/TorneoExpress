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
import com.TorneosExpress.repository.TournamentTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;
    private final TournamentTeamRepository tournamentTeamRepository;

    @Autowired
    public TournamentService(TournamentRepository tournamentRepository, TeamRepository teamRepository, MatchRepository matchRepository, TournamentTeamRepository tournamentTeamRepository) {
        this.tournamentRepository = tournamentRepository;
        this.teamRepository = teamRepository;
        this.matchRepository = matchRepository;
        this.tournamentTeamRepository = tournamentTeamRepository;
    }

    public List<Team> getTeamsOfTournament(Long tournamentId) {
        Tournament tournament = getTournamentById(tournamentId);
        return tournament.getParticipatingTeams();
    }


    public List<Match> getAllMatches(Long tournamentId) {
        Tournament tournament = getTournamentById(tournamentId);
        List<Match> matches = tournament.getMatches();


        // Verificar si todos los partidos han sido jugados
        boolean allMatchesPlayed = matches.stream().allMatch(Match::isPlayed);
        if(allMatchesPlayed){
            List<Team> winners = getWinnersFromMatches(matches);
            if(winners.isEmpty()){
                return matches;
            }
            if (tournament.getType() == Type.KNOCKOUT && !winners.isEmpty()) {
                switch (winners.size()) {
                    case 8:
                        return getTournamentFixtureKnockoutQuarterFinals(tournamentId, Type.KNOCKOUT);
                    case 4:
                        return getTournamentFixtureKnockoutSemifinals(tournamentId, Type.KNOCKOUT);
                    case 2:
                        return getTournamentFixtureKnockoutFinals(tournamentId, Type.KNOCKOUT);
                }
            }
        }

        return matches;
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

    public List<Match> getTournamentFixtureKnockoutQuarterFinals(Long tournamentId, Type type) {
        Tournament tournament = getTournamentById(tournamentId);
        List<Match> matchesWinner;
        List<Team> teamsWinners = getWinnersFromMatches(tournament.getMatches()); // Altero el original, para adecuarlo a los proximos partidos.
        List<Match> emptyMatches = List.of();

        if (tournament.getMatches() != null && tournament.getType() == Type.KNOCKOUT) {
            matchesWinner = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                    .build(teamsWinners, type);
            return matchesWinner;
        } else{
            return emptyMatches;
        }

    }

    public List<Match> getTournamentFixtureKnockoutSemifinals(Long tournamentId, Type type) {
        Tournament tournament = getTournamentById(tournamentId);
        List<Match> matchesWinner;
        List<Match> emptyMatches = List.of();

        List<Team> teamsWinners = getWinnersFromMatches(tournament.getMatches()); // Partidos de Semis. Tiene que haber 4 ganadores para mostrar, los resultados de semifinal.

        if (tournament.getMatches() != null && tournament.getType() == Type.KNOCKOUT && teamsWinners.size() == 4) {
            matchesWinner = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                    .build(teamsWinners, type);
            return matchesWinner;
        } else{
            return emptyMatches; // No muestro nada hasta que haya resultados de lo anterior.
        }
    }


    public List<Match> getTournamentFixtureKnockoutFinals(Long tournamentId, Type type) {
        Tournament tournament = getTournamentById(tournamentId);
        List<Match> matchesWinner;
        List<Team> teamsWinners = getWinnersFromMatches(tournament.getMatches()); // Altero el original, para adecuarlo a los proximos partidos.
        List<Match> emptyMatches = List.of();
        if (tournament.getMatches() != null && tournament.getType() == Type.KNOCKOUT) {
            matchesWinner = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                    .build(teamsWinners, type);
            return matchesWinner;
        } else{
            return emptyMatches; // No muestro nada hasta que haya resultados de lo anterior.
        }
    }


    private List<Team> getWinnersFromMatches(List<Match> matches) {
        List<Team> winners = new ArrayList<>();
        List<Team> emptyMatches = List.of();
        if(!matches.isEmpty()) {
            for (Match match : matches) {
                Optional<Team> winner = teamRepository.findById(match.getWinner());
                winner.ifPresent(winners::add);
            }
            return winners;
        } else{
            return emptyMatches;
        }
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

    public Match getMatchById(Long id) {
        Optional<Match> optionalMatch = matchRepository.findById(id);
        return optionalMatch.orElseThrow();
    }

    public Team findTeamById(long id) {
        return teamRepository.findById(id);
    }

    public TournamentTeam addPointsToTeam(Long tournamentId, Long teamId) {

        Tournament tournament = getTournamentById(tournamentId);
        Team team = findTeamById(teamId);

        TournamentTeam tournamentTeam = tournamentTeamRepository.findByTeamAndTournament(team, tournament);

        Type tournamentType = tournament.getType();

        if (tournamentType != Type.KNOCKOUT){
            tournamentTeam.addPoints(3);
        }

        return tournamentTeamRepository.save(tournamentTeam);
    }

}
