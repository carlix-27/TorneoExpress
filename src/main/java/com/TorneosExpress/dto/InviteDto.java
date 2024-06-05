package com.TorneosExpress.dto;

import java.time.LocalDateTime;

public class InviteDto {

    private Long id;
    private Long inviterId;
    private Long inviteeId;
    private Long teamId;
    private LocalDateTime createdAt = LocalDateTime.now();

    public InviteDto() {
    }

    public InviteDto(Long inviterId, Long inviteeId, Long teamId) {
        this.inviterId = inviterId;
        this.inviteeId = inviteeId;
        this.teamId = teamId;
    }

    public Long getInviterId() {
        return inviterId;
    }

    public void setInviterId(Long inviterId) {
        this.inviterId = inviterId;
    }

    public Long getInviteeId() {
        return inviteeId;
    }

    public void setInviteeId(Long inviteeId) {
        this.inviteeId = inviteeId;
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
}
