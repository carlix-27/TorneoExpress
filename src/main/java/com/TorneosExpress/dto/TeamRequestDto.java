package com.TorneosExpress.dto;

public class TeamRequestDto {

    private Long request_from;
    private Long request_to;
    private Long teamId;
    private Boolean accepted;
    private Boolean denied;

    public TeamRequestDto(Long request_from, Long request_to, Long teamId) {
        this.request_from = request_from;
        this.request_to = request_to;
        this.teamId = teamId;
        this.accepted = false;
        this.denied = false;
    }

    public Long getRequest_from() {
        return request_from;
    }

    public void setRequest_from(Long request_from) {
        this.request_from = request_from;
    }

    public Long getRequest_to() {
        return request_to;
    }

    public void setRequest_to(Long request_to) {
        this.request_to = request_to;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
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
