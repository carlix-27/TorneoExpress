package com.TorneosExpress.dto.team;

public class TeamPointsDto {
    private int matchPoints;

    public TeamPointsDto(int matchPoints) {
        this.matchPoints = matchPoints;
    }

    public int getMatchPoints() {
        return matchPoints;
    }

    public void setMatchPoints(int matchPoints) {
        this.matchPoints = matchPoints;
    }
}
