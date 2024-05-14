package com.TorneosExpress.controller;

import com.TorneosExpress.dto.AccessRequest;
import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.PlayerService;
import com.TorneosExpress.service.TeamService;
import com.TorneosExpress.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

/*También ver si es posible chequear otras cosas
* Si los capitanes o jugadores, cumplen los requisitos necesarios, etc. ¿Cómo veo esto?*/
@RestController
public class RequestController {
    @Autowired
    TournamentService tournamentService;

    @Autowired
    TeamService teamService;

    @Autowired
    PlayerService playerService;

    @PostMapping("/api/tournaments/{tournamentId}/access-request")
    public ResponseEntity<?> requestTournamentAccess(@PathVariable Long tournamentId, @PathVariable Long userId, @PathVariable Long teamId){
        try{
            tournamentService.processAccessRequest(tournamentId, userId, teamId);
            return ResponseEntity.ok().build();
        } catch (NullPointerException e){ // Casos de exception que tire los métodos.
            return ResponseEntity.badRequest().body(userId + " no encontrado");
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body("Tu equipo ya está en este torneo");
        }

    }

    @PostMapping("/api/tournaments/{tournamentId}/enroll")
    public ResponseEntity<?> accessToPublicTournament(@PathVariable Long tournamentId){ // mira como usar acá el tournamentId.
        return ResponseEntity.ok().body("Te has inscripto exitosamente al torneo");
    }

    @PostMapping("/api/teams/{teamId}/access-request")
    public ResponseEntity<?> requestTeamAccess(@PathVariable Long teamId, @PathVariable Long userId){
        teamService.processAccessRequest(teamId, userId);
        return ResponseEntity.ok().build();
    }



}



