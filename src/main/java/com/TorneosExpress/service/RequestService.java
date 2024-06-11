package com.TorneosExpress.service;

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

    public TournamentRequest sendTournamentRequest(Long from, Long to, Long team, String teamName, Long tournamentId, String name) {
        TournamentRequest request = new TournamentRequest(from, to, team, teamName, tournamentId);
        return tournamentRequestRepository.save(request);
    }


    public List<TeamRequest> getRequestsByTeam(Long toId, Long teamId) {
        return teamRequestRepository.findByRequestToAndTeamId(toId, teamId);
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

        if (request.isAccepted() || request.isDenied()) {
            throw new RuntimeException("Team request already processed");
        }

        request.setAccepted(true);
        Tournament tournament = tournamentRepository.findById(request.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Team team = teamRepository.findById(request.getRequestFrom())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        tournament.getParticipatingTeams().add(team);


        tournamentRepository.save(tournament);

        tournamentRequestRepository.delete(request);

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
