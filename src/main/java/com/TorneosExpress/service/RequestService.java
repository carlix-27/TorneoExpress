package com.TorneosExpress.service;

import com.TorneosExpress.model.Invite;
import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.TeamRequest;
import com.TorneosExpress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {

    private final InviteRepository inviteRepository;
    private final TeamRequestRepository teamRequestRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final TournamentRequestRepository tournamentRequestRepository;

    @Autowired
    public RequestService(InviteRepository inviteRepository, TeamRequestRepository teamRequestRepository, TeamRepository teamRepository, PlayerRepository playerRepository, TournamentRequestRepository tournamentRequestRepository) {
        this.inviteRepository = inviteRepository;
        this.teamRequestRepository = teamRequestRepository;
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.tournamentRequestRepository = tournamentRequestRepository;
    }

    public Invite sendInvite(Long from, Long to, Long team) {
        Invite invite = new Invite(from, to, team);
        return inviteRepository.save(invite);
    }

    public Invite getInviteById(Long id) {
        return inviteRepository.findById(id).orElse(null);
    }

    public void acceptInvite(Long inviteId) throws Exception {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new Exception("Invite not found"));
        inviteRepository.delete(invite);
    }

    public void denyInvite(Long inviteId) throws Exception {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new Exception("Invite not found"));
        inviteRepository.delete(invite);
    }

    public TeamRequest sendTeamRequest(Long from, Long to, Long team, String name) {
        TeamRequest request = new TeamRequest(from, to, team, name);
        return teamRequestRepository.save(request);
    }

    public List<TeamRequest> getAllTeamRequestsByToId(Long toId) {
        return teamRequestRepository.findByrequestTo(toId);
    }

    public List<TeamRequest> getRequestsByTeam(Long toId, Long teamId) {
        return teamRequestRepository.findByRequestToAndTeamId(toId, teamId);
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



}
