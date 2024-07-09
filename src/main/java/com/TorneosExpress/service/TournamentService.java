package com.TorneosExpress.service;

import com.TorneosExpress.dto.ActiveMatch;
import com.TorneosExpress.dto.tournament.ActiveMatchesFixtureDto;
import com.TorneosExpress.dto.tournament.FixtureDto;
import com.TorneosExpress.dto.tournament.MatchDto;
import com.TorneosExpress.dto.tournament.ShortMatchDto;
import com.TorneosExpress.fixture.ActiveMatchFixture;
import com.TorneosExpress.fixture.ActiveMatchesFixtureBuilder;
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

import java.util.ArrayList;
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


    public ActiveMatchesFixtureDto getActiveMatches(Long tournamentId){ // TODO
        Tournament tournament = getTournamentById(tournamentId);
        if(tournament == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found");
        }

        // Crear una instancia de FixtureBuilder y construir el Fixture
        Fixture fixture = new FixtureBuilder(
                tournamentId, tournament.getLocation(), tournament.getStartDate(), matchRepository)
                .build(tournament.getParticipatingTeams());

        ActiveMatchFixture activeMatchFixture = new ActiveMatchesFixtureBuilder(tournamentId, fixture).build(tournament.getParticipatingTeams());

        ActiveMatchesFixtureDto activeMatchesFixtureDto = new ActiveMatchesFixtureDto();
        activeMatchesFixtureDto.setMatches(convertToShortMatchDto(activeMatchFixture.getMatches()));

        return activeMatchesFixtureDto;
    }

    private List<ShortMatchDto> convertToShortMatchDto(List<ActiveMatch> activeMatches) {
        List<ShortMatchDto> dtoActiveMatches = new ArrayList<>();
        for(ActiveMatch match: activeMatches){
            ShortMatchDto shortMatchDto = new ShortMatchDto();
            shortMatchDto.setMatchId(match.getMatchId());
            shortMatchDto.setTeam1_id(match.getTeam1Id());
            shortMatchDto.setTeam2_id(match.getTeam2Id());
            shortMatchDto.setTeamName1(match.getTeamName1());
            shortMatchDto.setTeamName2(match.getTeamName2());
            dtoActiveMatches.add(shortMatchDto);
        }
        return dtoActiveMatches;
    }

    @Transactional
    public FixtureDto getTournamentCalendar(Long tournamentId) {
        Tournament tournament = getTournamentById(tournamentId);
        Fixture fixture;
        FixtureDto fixtureDto = new FixtureDto();

        if (tournament.getFixture() == null || tournament.getFixture().getMatches().isEmpty()) {
            List<Team> teams = tournament.getParticipatingTeams();
            teamRepository.saveAll(teams); // Ensure teams are saved

            // Refresh the teams list to ensure we have managed entities
            teams = teamRepository.findAllById(teams.stream().map(Team::getId).collect(Collectors.toList()));

            fixture = new FixtureBuilder(
                tournamentId, tournament.getLocation(), tournament.getStartDate(), matchRepository)
                .build(teams);

            tournament.setFixture(fixture);
            tournamentRepository.save(tournament);
        } else {
            fixture = tournament.getFixture();
        }

        fixtureDto.setMatches(convertToDtoFormat(fixture.getMatches()));
        return fixtureDto;
    }

    private List<MatchDto> convertToDtoFormat(List<Match> matches) {
        List<MatchDto> matchDtos = new ArrayList<>();
        for (Match match : matches) {
            MatchDto matchDto = new MatchDto();
            matchDto.setMatchId(match.getMatch_id());
            matchDto.setDate(match.getDate());
            matchDto.setLocation(match.getMatch_location());
            matchDto.setTeam1_id(match.getTeam1_id());
            matchDto.setTeam2_id(match.getTeam2_id());
            matchDto.setTeamName1(match.getTeamName1());
            matchDto.setTeamName2(match.getTeamName2());
            matchDtos.add(matchDto);
        }
        return matchDtos;
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
