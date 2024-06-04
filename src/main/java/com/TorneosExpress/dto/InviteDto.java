package com.TorneosExpress.dto;

public class InviteDto {
    private Long inviterId;
    private Long inviteeId;
    private Long teamId;

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
}
