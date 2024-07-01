package com.TorneosExpress.dto;

import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Team;

public class ActiveMatch {
    private final Long match_id;
    private final Long team1_id;
    private final Long team2_id;
    private final Long tournament_id;
    private String teamName1;
    private String teamName2;


    public ActiveMatch(Long match_id, Long team1_id, Long team2_id, Long tournament_id, String teamName1, String teamName2){
        this.match_id = match_id;
        this.team1_id = team1_id;
        this.team2_id = team2_id;
        this.tournament_id = tournament_id;
        this.teamName1 = teamName1;
        this.teamName2 = teamName2;
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

    public Long getMatchId(){ return match_id; }

    public Long getTournamentId(){return tournament_id;}

}
