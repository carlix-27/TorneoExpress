package com.TorneosExpress.model;

import com.TorneosExpress.dto.tournament.TournamentRequestDto;
import jakarta.persistence.*;

@Entity
public class TournamentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FROM_ID")
    private Long requestFrom;

    @Column(name = "TO_ID")
    private Long requestTo;

    @Column
    private Long teamId;

    @Column
    private String teamName;

    @Column
    private Long tournamentId;


    @Column(nullable = false)
    private boolean accepted;


    @Column(nullable = false)
    private boolean denied;

    public TournamentRequest(){}

    public TournamentRequest(TournamentRequestDto tournamentRequestDto){
        this.requestFrom = tournamentRequestDto.getRequestFrom();
        this.requestTo = tournamentRequestDto.getRequestTo();
        this.teamId = tournamentRequestDto.getTeamId();
        this.teamName = tournamentRequestDto.getTeamName();
        this.tournamentId = tournamentRequestDto.getTournamentId();
        this.accepted = tournamentRequestDto.getAccepted();
        this.denied = tournamentRequestDto.getDenied();
    }

    public TournamentRequest(Long requestFrom, Long requestTo, Long teamId, String teamName, Long tournamentId) {
        this.requestFrom = requestFrom;
        this.requestTo = requestTo;
        this.teamId = teamId;
        this.teamName = teamName;
        this.tournamentId = tournamentId;
        this.accepted = false;
        this.denied = false;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequestFrom() {
        return requestFrom;
    }

    public void setRequestFrom(Long request_from) {
        this.requestFrom = request_from;
    }

    public Long getRequestTo() {
        return requestTo;
    }

    public void setRequestTo(Long request_to) {
        this.requestTo = request_to;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public boolean isDenied() {
        return denied;
    }

    public void setDenied(boolean denied) {
        this.denied = denied;
    }

    public Long getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(Long tournamentId) {
        this.tournamentId = tournamentId;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }


}
