package com.TorneosExpress.dto;

import com.TorneosExpress.dto.team.TeamWinnerPointsDto;

public class StatisticsDto {
    private TeamWinnerPointsDto winner;
    private int team1Score;
    private int team2Score;

    public StatisticsDto(TeamWinnerPointsDto winner, int team1Score, int team2Score){
        this.winner = winner;
        this.team1Score = team1Score;
        this.team2Score = team2Score;
    }

    public StatisticsDto(){}

    // Getters y setters

    public TeamWinnerPointsDto getWinner(){
        return winner;
    }

    public void setWinner(TeamWinnerPointsDto winner){
        this.winner = winner;
    }

    public int getTeam1Score() {
        return team1Score;
    }

    public void setTeam1Score(int team1Score) {
        this.team1Score = team1Score;
    }

    public int getTeam2Score() {
        return team2Score;
    }

    public void setTeam2Score(int team2Score) {
        this.team2Score = team2Score;
    }
}
