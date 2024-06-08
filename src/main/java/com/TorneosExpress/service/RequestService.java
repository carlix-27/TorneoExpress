package com.TorneosExpress.service;

import com.TorneosExpress.model.Invite;
import com.TorneosExpress.repository.InviteRepository;
import com.TorneosExpress.repository.TeamRequestRepository;
import com.TorneosExpress.repository.TournamentRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RequestService {

    private final InviteRepository inviteRepository;
    private final TeamRequestRepository teamRequestRepository;
    private final TournamentRequestRepository tournamentRequestRepository;

    @Autowired
    public RequestService(InviteRepository inviteRepository, TeamRequestRepository teamRequestRepository, TournamentRequestRepository tournamentRequestRepository) {
        this.inviteRepository = inviteRepository;
        this.teamRequestRepository = teamRequestRepository;
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

}
