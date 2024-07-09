package com.TorneosExpress.controller;


import com.TorneosExpress.dto.ShortTeamDto;
import com.TorneosExpress.dto.team.TeamPointsDto;
import com.TorneosExpress.dto.tournament.Fixture;
import com.TorneosExpress.dto.tournament.FixtureBuilder;
import com.TorneosExpress.dto.tournament.TournamentDto;
import com.TorneosExpress.model.*;
import com.TorneosExpress.repository.MatchRepository;
import com.TorneosExpress.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;
    private final MatchRepository matchRepository;

    @Autowired
    public TournamentController(TournamentService tournamentService, MatchRepository matchRepository) {
        this.tournamentService = tournamentService;
        this.matchRepository = matchRepository;
    }

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

    @PutMapping("{tournamentId}/endTournament")
    public ResponseEntity<?> endTournament(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentService.getTournamentById(tournamentId);
        if(tournament == null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tournament name must be unique.");
        } else{
            tournament.setActive(false);
            return ResponseEntity.ok(tournamentService.updateTournament(tournament));
        }
    }

    @GetMapping("/history")
    public List<Tournament> getTournamentHistory() {
        return tournamentService.getInactiveTournaments();
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
    public Fixture getTournamentCalendar(@PathVariable Long tournamentId) {
        return tournamentService.getTournamentCalendar(tournamentId);
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


    @GetMapping("/{tournamentId}/teams")
    public ResponseEntity<List<ShortTeamDto>> getTeamsOfTournament(@PathVariable Long tournamentId) {
        List<ShortTeamDto> teams = tournamentService.getTeamsOfTournament(tournamentId).stream()
                .map(Team::shortTeamDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(teams);
    }

    @GetMapping("/{tournamentId}/teamsScore")
    public ResponseEntity<List<TeamPointsDto>> getTeamsScoreOfTournament(@PathVariable Long tournamentId) {
        List<TeamPointsDto> teams = tournamentService.getTeamsOfTournament(tournamentId).stream()
                .map(Team::teamPointsDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(teams);
    }

    @GetMapping("/{tournamentId}/activeMatches")
    public List<Match> getActiveMatches(@PathVariable Long tournamentId) {
        return tournamentService.getActiveMatches(tournamentId);
    }

    @PostMapping("/{tournamentId}/createMatches")
    public ResponseEntity<Void> createMatches(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentService.getTournamentById(tournamentId);
        if (tournament == null) {
            return ResponseEntity.notFound().build();
        }

        List<Match> existingMatches = matchRepository.findByTournamentId(tournamentId);
        if (!existingMatches.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        List<Team> teamList = tournament.getParticipatingTeams();
        FixtureBuilder fixtureBuilder = new FixtureBuilder(tournament, "Some Location", LocalDate.now(), matchRepository);
        fixtureBuilder.build(teamList);

        return ResponseEntity.ok().build();
    }



}
