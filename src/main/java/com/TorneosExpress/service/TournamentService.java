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
import com.zaxxer.hikari.util.FastList;
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

        // Verificar si todos los partidos han sido jugados / Sirve para el Knockout
        boolean allMatchesPlayed = matches.stream().allMatch(Match::isPlayed);
        if(allMatchesPlayed && tournament.getType() == Type.KNOCKOUT){
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

    // Todo: Voy a resolver la primer vinculacion que hay aca. Luego con el resto. De esa forma encaro el problema a pedazos.
    // Todo: En lugar de volver a llamar a tournament, no habra una forma de hacerlo mas sencillo en base a el estado que tiene tournament.getMatches()?
    // Todo: el get, hace que el codigo siempre se ejecute. Por tanto, el new FixtureBuilder va a volver a hacerse. La idea es evitar eso para evitar duplicaciones de id.
    public List<Match> getTournamentFixtureKnockoutQuarterFinals(Long tournamentId, Type type) {
        Tournament tournament = getTournamentById(tournamentId);
        List<Match> matchesWinner;
        // List<Match> matchesOfQuarterFinals = tournament.getQuarterFinalMatches();
        List<Match> emptyMatches = List.of();

        List<Team> teamsWinners = getWinnersFromMatches(tournament.getMatches()); // Partidos de Cuartos. Tiene que haber 8 ganadores para mostrar, los resultados de semifinal.

        if (tournament.getType() == Type.KNOCKOUT && teamsWinners.size() == 8) {
            //matchesWinner = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
            //      .build(teamsWinners, type);
            matchesWinner = tournament.getMatches();
            matchesWinner.addAll(new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                    .build(teamsWinners, type));

            return matchesWinner;
        }

        return emptyMatches;
    }



    /* if (tournament.getMatches() != null && tournament.getType() == Type.KNOCKOUT && teamsWinners.size() == 8 && matchesOfQuarterFinals.size() != 4) { // Si no es 4, no agrego. Por tanto se asume que ya agregue los partidos correspondientes.
            matchesWinner = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                    .build(teamsWinners, type);

            for(Match match : matchesWinner){
                matchesOfQuarterFinals.add(tournament.addQuarterFinalMatch(match));
            }
        } else{
            return matchesOfQuarterFinals; // Devuelvo los partidos que corresponden.
        }
        return emptyMatches;
    } */

    public List<Match> getTournamentFixtureKnockoutSemifinals(Long tournamentId, Type type) {
        Tournament tournament = getTournamentById(tournamentId);
        List<Match> matchesWinner;
        // List<Match> matchesOfSemifinals = tournament.getSemifinalMatches();
        List<Match> emptyMatches = List.of();

        List<Team> teamsWinners = getWinnersFromMatches(tournament.getMatches()); // Partidos de Cuartos. Tiene que haber 8 ganadores para mostrar, los resultados de semifinal.

        if (tournament.getType() == Type.KNOCKOUT && teamsWinners.size() == 8) {
            matchesWinner = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                    .build(teamsWinners, type);
            return matchesWinner;
        }

        return emptyMatches;
    }



        /*List<Team> teamsWinners = getWinnersFromMatches(tournament.getMatches()); // Partidos de Semis. Tiene que haber 4 ganadores para mostrar, los resultados de semifinal.

        if (tournament.getMatches() != null && tournament.getType() == Type.KNOCKOUT && teamsWinners.size() == 4 && matchesOfSemifinals.size() != 2) { // Si no es 2, no agrego. Por tanto se asume que ya agregue los partidos correspondientes.
            matchesWinner = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                    .build(teamsWinners, type);

            for(Match match : matchesWinner){
                matchesOfSemifinals.add(tournament.addSemifinalMatch(match));
            }
        } else{
            return matchesOfSemifinals; // Devuelvo los partidos que corresponden.
        }
        return emptyMatches;*/


    public List<Match> getTournamentFixtureKnockoutFinals(Long tournamentId, Type type) {
        Tournament tournament = getTournamentById(tournamentId);
        List<Match> matchesWinner;
        // List<Match> matchesOfFinal = tournament.getFinalMatches();
        List<Match> emptyMatches = List.of();

        List<Team> teamsWinners = getWinnersFromMatches(tournament.getMatches()); // Partidos de Semis. Tiene que haber 4 ganadores para mostrar, los resultados de semifinal.

        if (tournament.getType() == Type.KNOCKOUT && teamsWinners.size() == 8) {
            matchesWinner = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                    .build(teamsWinners, type);
            return matchesWinner;
        }

        return emptyMatches;

    }

        /*if (tournament.getMatches() != null && tournament.getType() == Type.KNOCKOUT && teamsWinners.size() == 2 && matchesOfFinal.size() != 1) { // Si no es 1, no agrego. Por tanto se asume que ya agregue los partidos correspondientes.
            matchesWinner = new FixtureBuilder(tournament.getLocation(), tournament.getStartDate(), matchRepository)
                    .build(teamsWinners, type);

            for(Match match : matchesWinner){
                matchesOfFinal.add(tournament.addFinalMatch(match));
            }
        } else{
            return matchesOfFinal; // Devuelvo los partidos que corresponden.
        }
        return emptyMatches;*/


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


    public Tournament endTournament(Long tournamentId){
        Tournament tournament = getTournamentById(tournamentId);
        endTournamentWithWinner(tournament, tournament.getParticipatingTeams()); // Debo setear el winner. Aca el winner es null.
        tournament.setActive(false);
        return tournamentRepository.save(tournament);
    }


    private void endTournamentWithWinner(Tournament tournament, List<Team> winnersOfMatches) {
        switch (tournament.getType()){
            case ROUNDROBIN:
                endTournamentForRoundRobin(tournament, winnersOfMatches); // Aca debo determinar cual es el winner segun los winners de cada partido.
                break;
            case KNOCKOUT:
                endTournamentForKnockout(tournament, winnersOfMatches);
                break;
            case GROUPSTAGE:
                endTournamentForGroupStage(tournament, winnersOfMatches);
                break;
        }
    }

    // winnersOfMatches equivalen a los winners de cada partido. Se determina el winner de todo el torneo, en base a su cantidad de tournamentPoints.


    // TODO
    private void endTournamentForRoundRobin(Tournament tournament, List<Team> winnersOfMatches){
        List<Integer> listWithTeamPoints = new ArrayList<>(tournament.getMaxTeams()); // Guarda los puntos que hizo cada Team. Como maximo la lista no puede exceder el tamano de los teams registrados.
        int maxPoints = -1;
        for(Team team : winnersOfMatches){
            if(team != null) {
                TournamentTeam tournamentTeam = tournamentTeamRepository.findByTeamAndTournament(team, tournament); // Fijate aca de buscarlo por id.
                int teamPoints = tournamentTeam.getTournamentPoints(); // No se aun si estos puntos, son los del winner, pero los voy a ir acumulando, en listWithTeamPoints
                // TODO: Este tournamentTeam no es el mismo que tiene seteado los points de cada uno.. es raro eso.
                listWithTeamPoints.add(teamPoints);
            }
        }

        for(int teamPoints: listWithTeamPoints){
            if(teamPoints > maxPoints){
                maxPoints = teamPoints; // Voy comparando hasta hallar el team con maximos puntos
            }
        }

        TournamentTeam tournamentTeamWithMaxPoints = tournamentTeamRepository.findByTournamentPointsAndTournament(maxPoints, tournament); // Busco al team con esa cantidad de puntos y el torneo en el que esta, para evitar problemas de busqueda por repeticion de puntaje.

        Team teamWinner = tournamentTeamWithMaxPoints.getTeam(); // El que encuentre, es el ganador del torneo.

        setPrestigePointsForTeam(tournamentTeamWithMaxPoints.getTournament(), teamWinner); // Seteo los puntos de prestigio al team que corresponda.

        tournamentTeamWithMaxPoints.getTournament().setWinner(teamWinner); // Seteo el winner del tournament.
    }


    private void endTournamentForKnockout(Tournament tournament, List<Team> teamWinner){

    }

    private void endTournamentForGroupStage(Tournament tournament, List<Team> teamWinner){

    }

    private void setPrestigePointsForTeam(Tournament tournament, Team teamWinner) {
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

    public Match updateMatchStats(Long matchId, SaveMatchStatsDto statsDto) { // Todo. Solo funciona para octavos de final.
        Match match = getMatchById(matchId);

        if(!match.isPlayed()){
            int team1score = statsDto.getTeam1Score();
            int team2score = statsDto.getTeam2Score();
            Long winnerId = statsDto.getWinner();

            match.setFirstTeamScore(team1score);
            match.setSecondTeamScore(team2score);
            match.setWinner(winnerId);
            match.setPlayed(true);

            return matchRepository.save(match);
        }

        return null;
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

        if(tournamentTeam.getTournamentPoints() == null){
            tournamentTeam.setTournamentPoints(0); // aseguro que sea 0 si es null.
        }

        if (tournamentType != Type.KNOCKOUT){ // Sino es null, agregar puntaje.
            tournamentTeam.addPoints(3);
        }


        return tournamentTeamRepository.save(tournamentTeam);
    }

    /*private Integer getPointsToTeam(Tournament tournament,  Team team) {
        TournamentTeam tournamentTeam = tournamentTeamRepository.findByTeamAndTournament(team, tournament);
        TournamentTeam tournamentTeam1 = tournamentTeamRepository.findByTournamentPointsAndTournament(tournamentTeam.getTournamentPoints(), tournament);
        return tournamentTeam1.getTournamentPoints();
    }*/


}
