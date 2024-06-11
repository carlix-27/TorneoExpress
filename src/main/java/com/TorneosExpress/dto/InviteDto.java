package com.TorneosExpress.dto;

import java.time.LocalDateTime;

public class InviteDto {

    private Long id;
    private Long inviteFrom;
    private Long inviteTo;
    private Long teamId;
    private Boolean accepted;
    private Boolean denied;
    private LocalDateTime createdAt = LocalDateTime.now();

    public InviteDto() {
    }

    public InviteDto(Long inviteFrom, Long invite_to, Long teamId) {
        this.inviteFrom = inviteFrom;
        this.inviteTo = invite_to;
        this.teamId = teamId;
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

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAccepted() {
        return accepted;
    }

    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }

    public Boolean getDenied() {
        return denied;
    }

    public void setDenied(Boolean denied) {
        this.denied = denied;
    }
}
