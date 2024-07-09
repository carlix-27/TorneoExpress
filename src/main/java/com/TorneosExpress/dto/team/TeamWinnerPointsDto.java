package com.TorneosExpress.dto.team;


public class TeamWinnerPointsDto { // Si jode, vola el name al carajo. Solo nos interesa el id del team, y le asignamos los puntos.
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

    public Long getId() { // En teoria esto, deberia tener un dato que es el id del team ganador.
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public Long setId(Long id) {
        return id;
    }
    public int getPrestigePoints() {
        return prestigePoints;
    }

    public void setPrestigePoints(int prestigePoints) {
        this.prestigePoints = prestigePoints;
    }


}
