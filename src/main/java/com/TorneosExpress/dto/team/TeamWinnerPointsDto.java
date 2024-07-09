package com.TorneosExpress.dto.team;

public class TeamWinnerPointsDto {
    private Long id;
    private String name;
    private int prestigePoints;

    public TeamWinnerPointsDto() {

    }

    public TeamWinnerPointsDto(Long id, String name, int prestigePoints){
        this.id = id;
        this.name = name;
        this.prestigePoints = prestigePoints;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrestigePoints() {
        return prestigePoints;
    }

    public void setPrestigePoints(int prestigePoints) {
        this.prestigePoints = prestigePoints;
    }


}
