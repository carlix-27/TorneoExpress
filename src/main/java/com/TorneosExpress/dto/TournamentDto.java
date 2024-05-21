package com.TorneosExpress.dto;

import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Sport;

import java.util.Date;

public class TournamentDto {
    private final Long id;
    private final Long creatorId;
    private final String name;
    private final String location;
    private final Date startDate;
    private final Sport sport;
    private final boolean isPrivate;
    private final Difficulty difficulty;
    private final boolean isActive;
    private final int maxTeams;

    public TournamentDto(Long id, Long creatorId, String name, String location, Date date, Sport sport, boolean isPrivate, Difficulty difficulty, boolean isActive, int maxTeams){
        this.id = id;
        this.creatorId = creatorId;
        this.name = name;
        this.location = location;
        this.startDate = date;
        this.sport = sport;
        this.isPrivate = isPrivate;
        this.difficulty = difficulty;
        this.isActive = isActive;
        this.maxTeams = maxTeams;
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

    public Date getStartDate() {
        return startDate;
    }

    public Sport getSport(){return sport;}

    public boolean getIsPrivate(){return isPrivate;}

    public Difficulty getDifficulty(){return difficulty;}

    public boolean getIsActive(){
        return isActive;
    }

}
