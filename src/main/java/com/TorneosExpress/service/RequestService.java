package com.TorneosExpress.service;

import com.TorneosExpress.dto.tournament.TournamentRequestDto;
import com.TorneosExpress.model.*;
import com.TorneosExpress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {

    private final InviteRepository inviteRepository;
    private final TeamRequestRepository teamRequestRepository;
    private final TournamentRequestRepository tournamentRequestRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final PlayerRepository playerRepository;

    @Autowired
    public RequestService(InviteRepository inviteRepository, TeamRequestRepository teamRequestRepository, TeamRepository teamRepository, PlayerRepository playerRepository, TournamentRequestRepository tournamentRequestRepository, TournamentRepository tournamentRepository) {
        this.inviteRepository = inviteRepository;
        this.teamRequestRepository = teamRequestRepository;
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.tournamentRequestRepository = tournamentRequestRepository;
        this.tournamentRepository = tournamentRepository;
    }

    public Invite sendInvite(Long from, Long to, Long team) {
        Invite invite = new Invite(from, to, team);
        return inviteRepository.save(invite);
    }

    public List<Invite> getInvitesById(Long id) {
        return inviteRepository.findByInviteTo(id);
    }

    public Invite acceptInvite(Long inviteId) throws Exception {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new Exception("Invite not found"));

        invite.setAccepted(true);

        Team team = teamRepository.findById(invite.getTeam())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Player player = playerRepository.findById(invite.getInviteTo())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        team.getPlayers().add(player);
        teamRepository.save(team);

        inviteRepository.delete(invite);
        return invite;
    }

    public Invite denyInvite(Long inviteId) throws Exception {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new Exception("Invite not found"));


        invite.setDenied(true);
        inviteRepository.delete(invite);

        return invite;
    }


    public TeamRequest sendTeamRequest(Long from, Long to, Long team, String name) {
        TeamRequest request = new TeamRequest(from, to, team, name);
        return teamRequestRepository.save(request);
    }

    public TournamentRequest sendTournamentRequest(TournamentRequestDto tournamentRequestDto) {
        TournamentRequest request = new TournamentRequest(tournamentRequestDto);
        return tournamentRequestRepository.save(request);
    }


    public List<TeamRequest> getRequestsByTeam(Long toId, Long teamId) {
        return teamRequestRepository.findByRequestToAndTeamId(toId, teamId);
    }

    public List<Invite> getInvites(Long toId) {
        return inviteRepository.findByInviteTo(toId);
    }

    public List<TournamentRequest> getRequestsByTournament(Long toId, Long teamId) {
        List<TournamentRequest> requests = tournamentRequestRepository.findByRequestToAndTournamentId(toId, teamId);
        return requests;
    }

    public TeamRequest acceptTeamRequest(Long requestId) {
        TeamRequest request = teamRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Team request not found"));

        if (request.isAccepted() || request.isDenied()) {
            throw new RuntimeException("Team request already processed");
        }

        request.setAccepted(true);
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Player player = playerRepository.findById(request.getRequestFrom())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        team.getPlayers().add(player);
        teamRepository.save(team);

        teamRequestRepository.delete(request);

        return request;
    }


    public TournamentRequest acceptTournamentRequest(Long requestId) {
        TournamentRequest request = tournamentRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Team request not found"));

        checkAlreadyHandled(request);

        request.setAccepted(true);

        Long tournamentId = request.getTournamentId();
        Long teamRequesting = request.getTeamId();

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Team team = teamRepository.findById(teamRequesting)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        List<Team> participatingTeams = tournament.getParticipatingTeams();
        participatingTeams.add(team);

        tournamentRepository.save(tournament);

        tournamentRequestRepository.delete(request);

        return request;
    }

    private void checkAlreadyHandled(TournamentRequest request) {
        boolean requestAlreadyHandled = request.isAccepted() || request.isDenied();
        if (requestAlreadyHandled) {
            throw new RuntimeException("Team request already processed");
        }
    }

    public TeamRequest denyTeamRequest(Long requestId) {
        TeamRequest request = teamRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Team request not found"));

        if (request.isAccepted() || request.isDenied()) {
            throw new RuntimeException("Team request already processed");
        }

        request.setDenied(true);
        teamRequestRepository.delete(request);

        return request;
    }


    public TournamentRequest denyTournamentRequest(Long requestId) {
        TournamentRequest request = tournamentRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Team request not found"));

        if (request.isAccepted() || request.isDenied()) {
            throw new RuntimeException("Team request already processed");
        }

        request.setDenied(true);
        tournamentRequestRepository.delete(request);

        return request;
    }



}
