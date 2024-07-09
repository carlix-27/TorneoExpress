package com.TorneosExpress.dto.team;

public class TeamPointsDto {
    private int prestigePoints;

    public TeamPointsDto(int prestigePoints) {
        this.prestigePoints = prestigePoints;
    }

    public int getPrestigePoints() {
        return prestigePoints;
    }

    public void setPrestigePoints(int prestigePoints) {
        this.prestigePoints = prestigePoints;
    }
}
