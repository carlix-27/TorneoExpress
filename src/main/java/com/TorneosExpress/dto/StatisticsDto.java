package com.TorneosExpress.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatisticsDto {

    private Long winner;
    private int team1Score;
    private int team2Score;

    public StatisticsDto(Long winner, int team1Score, int team2Score){
        this.winner = winner;
        this.team1Score = team1Score;
        this.team2Score = team2Score;
    }
}
