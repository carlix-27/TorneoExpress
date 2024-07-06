package com.TorneosExpress.controller;


import com.TorneosExpress.dto.ShortTeamDto;
import com.TorneosExpress.dto.StatisticsDto;
import com.TorneosExpress.dto.tournament.ActiveMatchesFixtureDto;
import com.TorneosExpress.dto.tournament.FixtureDto;
import com.TorneosExpress.dto.tournament.TournamentDto;
import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.StatisticsService;
import com.TorneosExpress.service.TeamService;
import com.TorneosExpress.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;

    private Tournament tournament;

    @Autowired
    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private TeamService teamService;

    @PostMapping("/create")
    public ResponseEntity<?> createTournament(@RequestBody TournamentDto request) {

        String requestName = request.getName();

        boolean tournamentNameUnique = tournamentService.isTournamentNameUnique(requestName);

        if (tournamentNameUnique) {

            Tournament tournament = new Tournament(request);
            Tournament createdTournament = tournamentService.createTournament(tournament);
            createdTournament.setActive(true);
            return ResponseEntity.ok(createdTournament);

        } else{

            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tournament name must be unique.");
        }
    }


    @PostMapping("/add/{tournamentId}/{teamId}")
    public ResponseEntity<Tournament> addTeamToTournament(@PathVariable Long tournamentId, @PathVariable Long teamId) {
        try {
            Tournament team = tournamentService.addTeamToTournament(teamId, tournamentId);
            return new ResponseEntity<>(team, HttpStatus.CREATED);
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Tournament>> getTournamentsByUser(@PathVariable Long userId) {
        List<Tournament> tournaments = tournamentService.getTournamentsByUser(userId);
        return ResponseEntity.ok().body(tournaments);
    }

    @DeleteMapping("/{tournamentId}")
    public ResponseEntity<String> deleteTournament(@PathVariable Long tournamentId) {
        tournamentService.deleteTournament(tournamentId);
        return ResponseEntity.ok("Tournament deleted successfully");
    }

    @GetMapping("/{tournamentId}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentService.getTournamentById(tournamentId);
        if (tournament == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tournament);
    }

    @GetMapping("/{tournamentId}/calendar")
    public ResponseEntity<FixtureDto> getTournamentCalendar(@PathVariable Long tournamentId) {
        FixtureDto fixture = tournamentService.getTournamentCalendar(tournamentId);
        if (fixture == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(fixture);
    }
    

    @PutMapping("/{tournamentId}")
    public ResponseEntity<Tournament> updateTournament(@PathVariable Long tournamentId,
                                                       @RequestBody Tournament updatedTournament) {
        Tournament existingTournament = tournamentService.getTournamentById(tournamentId);
        if (existingTournament == null) {
            return ResponseEntity.notFound().build();
        }

        String updatedTournamentName = updatedTournament.getName();
        Sport updatedTournamentSport = updatedTournament.getSport();
        String updatedTournamentLocation = updatedTournament.getLocation();
        boolean updatedTournamentPrivate = updatedTournament.isPrivate();
        Difficulty updatedTournamentDifficulty = updatedTournament.getDifficulty();

        existingTournament.setName(updatedTournamentName);
        existingTournament.setSport(updatedTournamentSport);
        existingTournament.setLocation(updatedTournamentLocation);
        existingTournament.setPrivate(updatedTournamentPrivate);
        existingTournament.setDifficulty(updatedTournamentDifficulty);

        Tournament updatedTournamentEntity = tournamentService.updateTournament(existingTournament);
        return ResponseEntity.ok(updatedTournamentEntity);
    }


    @GetMapping("/active")
    public List<Tournament> getActiveTournaments() {
        return tournamentService.getActiveTournaments();
    }


    @GetMapping("{tournamentId}/teams")
    public ResponseEntity<List<ShortTeamDto>> getTeamsOfTournament(@PathVariable Long tournamentId) {
        List<ShortTeamDto> teams = tournamentService.getTeamsOfTournament(tournamentId).stream()
                .map(Team::shortTeamDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(teams);
    }

    @GetMapping("/{tournamentId}/activeMatches")
    public ResponseEntity<Map<String, ActiveMatchesFixtureDto>> getActiveMatches(@PathVariable Long tournamentId) {
        ActiveMatchesFixtureDto activeMatches = tournamentService.getActiveMatches(tournamentId);
        if (activeMatches == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Collections.singletonMap("matches", activeMatches));
    }

}
