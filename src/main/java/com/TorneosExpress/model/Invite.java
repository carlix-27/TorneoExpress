package com.TorneosExpress.model;

import com.TorneosExpress.dto.InviteDto;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FROM_ID")
    private Long invite_from;

    @Column(name = "TO_ID")
    private Long invite_to;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean accepted;

    @Column
    private Long team;

    public Invite() {
    }

    public Invite(Long from, Long invitee, Long team) {
        this.invite_from = from;
        this.invite_to = invitee;
        this.team = team;
        this.createdAt = LocalDateTime.now();
        this.accepted = false;
    }

    public Invite(InviteDto inviteDto){
        this.id = inviteDto.getId();
        this.invite_from = inviteDto.getInvite_from();
        this.invite_to = inviteDto.getInvite_from();
        this.team = inviteDto.getTeamId();
        this.createdAt = LocalDateTime.now();
        this.accepted = false;
    }

    // Getters and setters...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFrom() {
        return invite_from;
    }

    public void setFrom(Long inviter) {
        this.invite_from = inviter;
    }

    public Long getTo() {
        return invite_to;
    }

    public void setTo(Long invitee) {
        this.invite_to = invitee;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public Long getTeam() {
        return team;
    }

    public void setTeam(Long team) {
        this.team = team;
    }
}
