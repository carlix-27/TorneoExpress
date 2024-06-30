package com.TorneosExpress.service;

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
import com.TorneosExpress.repository.TeamRepository;
import com.TorneosExpress.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;

    @Autowired
    public TournamentService(TournamentRepository tournamentRepository, TeamRepository teamRepository) {
        this.tournamentRepository = tournamentRepository;
        this.teamRepository = teamRepository;
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

        ActiveMatchFixture fixture = new ActiveMatchesFixtureBuilder(tournamentId).build(tournament.getParticipatingTeams());

        ActiveMatchesFixtureDto activeMatchesFixtureDto = new ActiveMatchesFixtureDto();
        activeMatchesFixtureDto.setMatches(convertToShortMatchDto(fixture.getMatches()));

        return activeMatchesFixtureDto;
    }

    private List<ShortMatchDto> convertToShortMatchDto(List<Match> activeMatches) {
        List<ShortMatchDto> dtoActiveMatches = new ArrayList<>();
        for(Match match: activeMatches){
            ShortMatchDto shortMatchDto = new ShortMatchDto();
            shortMatchDto.setTeam1_id(match.getTeam1_id());
            shortMatchDto.setTeam2_id(match.getTeam2_id());
            shortMatchDto.setTeamName1(match.getTeamName1());
            shortMatchDto.setTeamName2(match.getTeamName2());
            dtoActiveMatches.add(shortMatchDto);
        }
        return dtoActiveMatches;
    }

    public FixtureDto getTournamentCalendar(Long tournamentId) {
        Tournament tournament = getTournamentById(tournamentId);
        Fixture fixture = new FixtureBuilder(
            tournamentId, tournament.getLocation(), tournament.getStartDate())
            .build(tournament.getParticipatingTeams());
        FixtureDto fixtureDto = new FixtureDto();
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
