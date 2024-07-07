package com.TorneosExpress.dto.team;

public class TeamWinnerPointsDto {
    private Long id;
    private String name;
    private int matchPoints;

    public TeamWinnerPointsDto(Long id, String name, int matchPoints){
        this.id = id;
        this.name = name;
        this.matchPoints = matchPoints;
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

    public int getMatchPoints() {
        return matchPoints;
    }

    public void setMatchPoints(int matchPoints) {
        this.matchPoints = matchPoints;
    }


}
