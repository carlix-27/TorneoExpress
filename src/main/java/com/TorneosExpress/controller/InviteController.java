package com.TorneosExpress.controller;

import com.TorneosExpress.model.Invite;
import com.TorneosExpress.service.InviteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/invites")
public class InviteController {

    @Autowired
    private final InviteService inviteService;

    @Autowired
    public InviteController(InviteService inviteService) {
        this.inviteService = inviteService;
    }

    @PostMapping("/send")
    public ResponseEntity<Invite> sendInvite(@RequestBody Map<String, Object> requestBody) {
        Long inviterId = (Long) requestBody.get("inviterId");
        Long inviteeId = (Long) requestBody.get("inviteeId");
        Long teamId = (Long) requestBody.get("teamId");

        Invite sentInvite = inviteService.sendInvite(inviterId, inviteeId, teamId);
        return new ResponseEntity<>(sentInvite, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invite> getInviteById(@PathVariable Long id) {
        Invite invite = inviteService.getInviteById(id);
        if (invite != null) {
            return new ResponseEntity<>(invite, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
