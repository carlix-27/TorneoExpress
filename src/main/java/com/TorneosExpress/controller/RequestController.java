package com.TorneosExpress.controller;

import com.TorneosExpress.dto.InviteDto;
import com.TorneosExpress.model.Invite;
import com.TorneosExpress.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invites")
public class RequestController {

    private final RequestService requestService;

    @Autowired
    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping("/create")
    public Invite sendInvite(@RequestBody InviteDto inviteRequest) {
        Long invite_from = inviteRequest.getInvite_from();
        Long invite_to = inviteRequest.getInvite_to();
        Long teamId = inviteRequest.getTeamId();
        return requestService.sendInvite(invite_from, invite_to, teamId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invite> getInviteById(@PathVariable Long id) {
        Invite invite = requestService.getInviteById(id);
        if (invite != null) {
            return new ResponseEntity<>(invite, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/accept/{inviteId}")
    public ResponseEntity<?> acceptInvite(@PathVariable Long inviteId) {
        try {
            requestService.acceptInvite(inviteId);
            return ResponseEntity.ok().body("Invite accepted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to accept invite.");
        }
    }

    @PostMapping("/deny/{inviteId}")
    public ResponseEntity<?> denyInvite(@PathVariable Long inviteId) {
        try {
            requestService.denyInvite(inviteId);
            return ResponseEntity.ok().body("Invite denied successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to deny invite.");
        }
    }
}
