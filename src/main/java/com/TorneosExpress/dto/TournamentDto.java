package com.TorneosExpress.dto;

import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Sport;

public class TournamentDto {
    private final Long id;
    private final Long creatorId;
    private final String name;
    private final String location;
    private final Sport sport;
    private final boolean isPrivate;
    private final Difficulty difficulty;
    private final boolean isActive;
    private int maxTeams;

    public TournamentDto(Long id, Long creatorId, String name, String location, Sport sport, boolean isPrivate, Difficulty difficulty, boolean isActive){
        this.id = id;
        this.creatorId = creatorId;
        this.name = name;
        this.location = location;
        this.sport = sport;
        this.isPrivate = isPrivate;
        this.difficulty = difficulty;
        this.isActive = isActive;
    }

    public Long getId(){
        return id;
    }

    public Long getCreatorId(){return creatorId;}

    public int getMaxTeams() {
        return maxTeams;
    }

    public String getName(){
        return name;
    }

    public String getLocation(){
        return location;
    }

    public Sport getSport(){return sport;}

    public boolean getIsPrivate(){return isPrivate;}

    public Difficulty getDifficulty(){return difficulty;}

    public boolean getIsActive(){
        return isActive;
    }

}
