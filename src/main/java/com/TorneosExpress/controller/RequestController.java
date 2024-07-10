package com.TorneosExpress.controller;

import com.TorneosExpress.dto.request.InviteDto;
import com.TorneosExpress.dto.team.TeamRequestDto;
import com.TorneosExpress.dto.tournament.TournamentRequestDto;
import com.TorneosExpress.model.Invite;
import com.TorneosExpress.model.TeamRequest;
import com.TorneosExpress.model.TournamentRequest;
import com.TorneosExpress.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    @Autowired
    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping("/invite/send")
    public Invite sendInvite(@RequestBody InviteDto inviteRequest) {

        Long invite_from = inviteRequest.inviteFrom();
        Long invite_to = inviteRequest.inviteTo();
        Long teamId = inviteRequest.teamId();

        return requestService.sendInvite(invite_from, invite_to, teamId);
    }

    @GetMapping("/invite/{id}")
    public List<Invite> getInvitesById(@PathVariable Long id) {
        return requestService.getInvitesById(id);
    }

    @GetMapping("/team/details/{id}")
    public Optional<TeamRequest> getTeamRequestById(@PathVariable Long id) {
        return requestService.getTeamRequestById(id);
    }

    @GetMapping("/tournament/details/{id}")
    public Optional<TournamentRequest> getTournamentRequestById(@PathVariable Long id) {
        return requestService.getTournamentRequestById(id);
    }

    @GetMapping("/invite/details/{requestId}")
    public Optional<Invite> getInvite(@PathVariable Long requestId) {
        return requestService.getInvite(requestId);
    }


    @DeleteMapping("/invite/deny/{inviteId}")
    public Invite denyInvite(@PathVariable Long inviteId) throws Exception {
        return requestService.denyInvite(inviteId);
    }

    @PostMapping("/team/send")
    public TeamRequest sendTeamRequest(@RequestBody TeamRequestDto teamRequestDto) {

        Long requestFromId = teamRequestDto.getRequestFrom();
        Long requestToId = teamRequestDto.getRequestTo();
        Long teamId = teamRequestDto.getTeamId();
        String name = teamRequestDto.getName();

        return requestService.sendTeamRequest(requestFromId, requestToId, teamId, name);
    }

    @PostMapping("/tournament/send")
    public TournamentRequest sendTournamentRequest(@RequestBody TournamentRequestDto tournamentRequestDto) {
        return requestService.sendTournamentRequest(tournamentRequestDto);
    }


    @GetMapping("/team/{toId}/{teamId}")
    public List<TeamRequest> getTeamRequests(@PathVariable Long toId, @PathVariable Long teamId) {
        return requestService.getRequestsByTeam(toId, teamId);
    }


    @GetMapping("/tournament/{toId}/{tournamentId}")
    public List<TournamentRequest> getTournamentRequests(@PathVariable Long toId, @PathVariable Long tournamentId) {
        return requestService.getRequestsByTournament(toId, tournamentId);
    }

    @DeleteMapping("/team/{requestId}/accept")
    public ResponseEntity<?> acceptTeamRequest(@PathVariable Long requestId) {
        try {
            TeamRequest request = requestService.acceptTeamRequest(requestId);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e){
            String localizedMessage = e.getLocalizedMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(localizedMessage);
        }
    }

    @DeleteMapping("/team/{requestId}/deny")
    public TeamRequest denyTeamRequest(@PathVariable Long requestId) {
        return requestService.denyTeamRequest(requestId);
    }

    @DeleteMapping("/invite/accept/{inviteId}")
    public ResponseEntity<?> acceptInvite(@PathVariable Long inviteId) {
        try {
            Invite invite = requestService.acceptInvite(inviteId);
            return ResponseEntity.ok(invite);
        } catch (RuntimeException e) {
            String localizedMessage = e.getLocalizedMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(localizedMessage);
        }
    }


    @DeleteMapping("/tournament/{requestId}/accept")
    public ResponseEntity<?> acceptTournamentRequest(@PathVariable Long requestId) {
        try {
            TournamentRequest request = requestService.acceptTournamentRequest(requestId);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            String localizedMessage = e.getLocalizedMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(localizedMessage);
        }
    }


    @DeleteMapping("/tournament/{requestId}/deny")
    public TournamentRequest denyTournamentRequest(@PathVariable Long requestId) {
        return requestService.denyTournamentRequest(requestId);
    }

}
