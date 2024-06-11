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
    private Long inviteFrom;

    @Column(name = "TO_ID")
    private Long inviteTo;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean accepted;

    @Column
    private boolean denied;

    @Column
    private Long team;

    public Invite() {
    }

    public Invite(Long from, Long invitee, Long team) {
        this.inviteFrom = from;
        this.inviteTo = invitee;
        this.team = team;
        this.createdAt = LocalDateTime.now();
        this.accepted = false;
    }

    public Invite(InviteDto inviteDto){
        this.id = inviteDto.getId();
        this.inviteFrom = inviteDto.getInviteFrom();
        this.inviteTo = inviteDto.getInviteFrom();
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
        return inviteFrom;
    }

    public void setFrom(Long inviter) {
        this.inviteFrom = inviter;
    }

    public Long getTo() {
        return inviteTo;
    }

    public void setTo(Long invitee) {
        this.inviteTo = invitee;
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

    public Long getInviteFrom() {
        return inviteFrom;
    }

    public void setInviteFrom(Long inviteFrom) {
        this.inviteFrom = inviteFrom;
    }

    public Long getInviteTo() {
        return inviteTo;
    }

    public void setInviteTo(Long inviteTo) {
        this.inviteTo = inviteTo;
    }

    public boolean isDenied() {
        return denied;
    }

    public void setDenied(boolean denied) {
        this.denied = denied;
    }
}
