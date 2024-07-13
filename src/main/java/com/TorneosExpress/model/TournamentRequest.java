package com.TorneosExpress.model;

import com.TorneosExpress.dto.tournament.TournamentRequestDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
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

}
