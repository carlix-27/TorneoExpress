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

    public Invite sendInvite(Invite invite) {
        return inviteRepository.save(invite);
    }

    public Invite getInviteById(Long id) {
        return inviteRepository.findById(id).orElse(null);
    }

    // Add other methods as needed
}
