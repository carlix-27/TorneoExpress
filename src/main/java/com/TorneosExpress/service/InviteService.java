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
        // Implement your business logic here (e.g., validation)
        // You can directly save the invite to the repository
        return inviteRepository.save(invite);
    }

    public Invite getInviteById(Long id) {
        // Retrieve the invite by ID from the repository
        return inviteRepository.findById(id).orElse(null);
    }

    // Add other methods as needed
}
