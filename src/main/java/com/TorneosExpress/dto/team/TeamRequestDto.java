package com.TorneosExpress.dto.team;

public class TeamRequestDto {

    private Long requestFrom;
    private Long requestTo;
    private Long teamId;
    private Boolean accepted;
    private Boolean denied;

    private String name;

    private Boolean sent;

    public TeamRequestDto(Long requestFrom, Long requestTo, Long teamId, String name) {
        this.requestFrom = requestFrom;
        this.requestTo = requestTo;
        this.teamId = teamId;
        this.accepted = false;
        this.denied = false;
        this.sent = true;
        this.name = name;
    }

    public Long getRequestFrom() {
        return requestFrom;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRequestFrom(Long requestFrom) {
        this.requestFrom = requestFrom;
    }

    public Boolean getSent() {
        return sent;
    }

    public void setSent(Boolean sent) {
        this.sent = sent;
    }

    public Long getRequestTo() {
        return requestTo;
    }

    public void setRequestTo(Long requestTo) {
        this.requestTo = requestTo;
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
