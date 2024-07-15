package com.TorneosExpress.service;

import com.TorneosExpress.dto.tournament.TournamentRequestDto;
import com.TorneosExpress.model.*;
import com.TorneosExpress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestService {

    private final InviteRepository inviteRepository;
    private final TeamRequestRepository teamRequestRepository;
    private final TournamentRequestRepository tournamentRequestRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final PlayerRepository playerRepository;
    private final SportRepository sportRepository;

    @Autowired
    public RequestService(InviteRepository inviteRepository, TeamRequestRepository teamRequestRepository, TeamRepository teamRepository, PlayerRepository playerRepository, TournamentRequestRepository tournamentRequestRepository, TournamentRepository tournamentRepository, SportRepository sportRepository) {
        this.inviteRepository = inviteRepository;
        this.teamRequestRepository = teamRequestRepository;
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.tournamentRequestRepository = tournamentRequestRepository;
        this.tournamentRepository = tournamentRepository;
        this.sportRepository = sportRepository;
    }

    public Invite sendInvite(Long from, Long to, Long team) {
        Invite invite = new Invite(from, to, team);
        return inviteRepository.save(invite);
    }

    public List<Invite> getInvitesById(Long id) {
        return inviteRepository.findByInviteTo(id);
    }

    public Optional<Invite> getInvite(Long id) {
        return inviteRepository.findById(id);
    }

    public Optional<TeamRequest> getTeamRequestById(Long id) {
        return teamRequestRepository.findById(id);
    }

    public Optional<TournamentRequest> getTournamentRequestById(Long id) {
        return tournamentRequestRepository.findById(id);
    }

    public Invite acceptInvite(Long inviteId) {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        invite.setAccepted(true);

        Team team = teamRepository.findById(invite.getTeam())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Player player = playerRepository.findById(invite.getInviteTo())
                .orElseThrow(() -> new RuntimeException("Player not found"));


        List<Player> teamPlayers = team.getPlayers();

        Sport sport = sportRepository.findBySportId(team.getSport().getSportId());

        boolean playerAlreadyInTeam = teamPlayers.contains(player);
        if (playerAlreadyInTeam) {
            throw new RuntimeException("El jugador ya pertenece al equipo");
        }

        int numOfPlayersInTeam = teamPlayers.size();
        int maxPlayers = getMaxPlayers(sport);

        boolean teamFull = numOfPlayersInTeam == maxPlayers;
        if (teamFull){
            throw new RuntimeException("El equipo ya esta en capacidad maxima");
        }

        teamPlayers.add(player);
        teamRepository.save(team);
        inviteRepository.delete(invite);
        return invite;
    }

    public int getMaxPlayers(Sport sport){
        int maxSportPlayers = sport.getNum_players();
        return maxSportPlayers * 2;
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


    public List<TeamRequest> getRequestsBySpecificTeam(Long toId, Long teamId) {
        return teamRequestRepository.findByRequestToAndTeamId(toId, teamId);
    }

    public List<TeamRequest> getRequestsByTeam(Long toId) {
        return teamRequestRepository.findByRequestTo(toId);
    }

    public List<TournamentRequest> getRequestsByTournament(Long toId) {
        return tournamentRequestRepository.findByRequestTo(toId);
    }

    public List<TournamentRequest> getRequestsBySpecificTournament(Long toId, Long teamId) {
        return tournamentRequestRepository.findByRequestToAndTournamentId(toId, teamId);
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


        List<Player> teamPlayers = team.getPlayers();

        boolean playerIsAlreadyInTeam = teamPlayers.contains(player);
        if (playerIsAlreadyInTeam) {
            throw new RuntimeException("El jugador ya pertenece al equipo");
        }

        Sport sport = team.getSport();



        int numOfPlayers = teamPlayers.size();
        int maxPlayers = getMaxPlayers(sport);

        if (numOfPlayers == maxPlayers){
            throw new RuntimeException("Numero máximo de jugadores en el equipo");
        }

        teamPlayers.add(player);
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

        if (participatingTeams.contains(team)) {
            throw new RuntimeException("El equipo ya esta participando");
        }

        if (participatingTeams.size() == tournament.getMaxTeams()){
            throw new RuntimeException("Se llego al numero máximo de equipos para este torneo");
        }

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
