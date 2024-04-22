package com.TorneosExpress.dto;

public class SportDto {
    private Long id;
    private String name;
    private int numPlayers;

    public SportDto(Long id, String name, int numPlayers) {
        this.id = id;
        this.name = name;
        this.numPlayers = numPlayers;
    }

    // Getters and setters

    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getName() {return name;}

    public void setName(String name) {this.name = name;}

    public int getNumPlayers() {return numPlayers;}

    public void setNumPlayers(int numPlayers) {this.numPlayers = numPlayers;}
}