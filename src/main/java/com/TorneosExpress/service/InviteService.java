package com.TorneosExpress.service;

import com.TorneosExpress.model.Invite;
import com.TorneosExpress.repository.InviteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InviteService {

    private final InviteRepository inviteRepository;

    @Autowired
    public InviteService(InviteRepository inviteRepository) {
        this.inviteRepository = inviteRepository;
    }

    public Invite sendInvite(Long inviterId, Long inviteeId, Long teamId) {
        Invite invite = new Invite(inviterId, inviteeId, teamId);
        return inviteRepository.save(invite);
    }

    public Invite getInviteById(Long id) {
        return inviteRepository.findById(id).orElse(null);
    }

}
