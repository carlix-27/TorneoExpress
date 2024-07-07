package com.TorneosExpress.dto;

public class ShortTournamentDto {
    private final Long id;
    private final String name;

    public ShortTournamentDto(Long id, String name){
        this.id = id;
        this.name = name;
    }

    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }
}
