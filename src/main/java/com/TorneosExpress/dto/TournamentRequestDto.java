package com.TorneosExpress.dto;

public class TournamentRequestDto {




    private Long requestFrom;
    private Long requestTo;
    private Long tournamentId;
    private Boolean accepted;
    private Boolean denied;
    private String name;



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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


}
