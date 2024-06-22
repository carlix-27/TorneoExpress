package com.TorneosExpress.dto.tournament;

public class TournamentRequestDto {

    private Long requestFrom;
    private Long requestTo;
    private Long teamId;
    private String teamName;
    private Long tournamentId;
    private Boolean accepted;
    private Boolean denied;

    public TournamentRequestDto(Long requestFrom, Long requestTo, Long tournamentId, Boolean accepted, Boolean denied, String teamName) {
        this.requestFrom = requestFrom;
        this.requestTo = requestTo;
        this.tournamentId = tournamentId;
        this.accepted = accepted;
        this.denied = denied;
        this.teamName = teamName;
    }


    public Long getRequest_from() {
        return requestFrom;
    }

    public void setRequest_from(Long request_from) {
        this.requestFrom = request_from;
    }

    public Long getRequest_to() {
        return requestTo;
    }

    public void setRequest_to(Long request_to) {
        this.requestTo = request_to;
    }

    public Long getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(Long tournamentId) {
        this.tournamentId = tournamentId;
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

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getRequestTo() {
        return requestTo;
    }

    public void setRequestTo(Long requestTo) {
        this.requestTo = requestTo;
    }

    public Long getRequestFrom() {
        return requestFrom;
    }

    public void setRequestFrom(Long requestFrom) {
        this.requestFrom = requestFrom;
    }


}
