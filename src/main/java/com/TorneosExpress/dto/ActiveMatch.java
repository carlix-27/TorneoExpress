package com.TorneosExpress.dto;

import com.TorneosExpress.model.Team;

public class ActiveMatch {
    private final Long team1_id;
    private final Long team2_id;
    private final Long tournament_id;
    private String status;
    private String teamName1;
    private String teamName2;

    public ActiveMatch(Team team1, Team team2, Long tournament_id, String status){
        this.team1_id = team1.getId();
        this.team2_id = team2.getId();
        this.tournament_id = tournament_id;
        this.status = status;
        this.teamName1 = team1.getName();
        this.teamName2 = team2.getName();
    }

    public Long getTeam1Id(){
        return team1_id;
    }

    public Long getTeam2Id(){
        return team2_id;
    }

    public String getTeamName1(){
        return teamName1;
    }

    public String getTeamName2(){
        return teamName2;
    }


}
