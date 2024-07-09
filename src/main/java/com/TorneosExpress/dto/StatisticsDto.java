package com.TorneosExpress.dto;

public class StatisticsDto {
    private Long winner;
    private int team1Score;
    private int team2Score;

    public StatisticsDto(Long winner, int team1Score, int team2Score){
        this.winner = winner;
        this.team1Score = team1Score;
        this.team2Score = team2Score;
    }

    public StatisticsDto(){}


    public Long getWinner(){
        return winner;
    }

    public void setWinner(Long winner){
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
