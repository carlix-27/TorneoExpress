package com.TorneosExpress.model;

import com.TorneosExpress.dto.ActiveMatch;
import com.TorneosExpress.dto.ShortTournamentDto;
import jakarta.persistence.*;

@Entity
public class Statistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statisticsId;

    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @OneToOne
    @JoinColumn(name = "matchId", nullable = false)
    private Match match;


    private Integer team1Score;
    private Integer team2Score;

    @OneToOne
    @JoinColumn(name = "id", nullable = false)
    private Team ganador;


    // Getters y setters
    public Long getMatchId(){
        return match.getMatch_id();
    }

    public Long getTournamentId(){
        return tournament.getId();
    }


    public void setTournament(Tournament tournament){
        this.tournament = tournament;
    }

    public void setShortTournamentDto(ShortTournamentDto shortTournamentDto){
        this.tournament = new Tournament();
        this.tournament.setId(shortTournamentDto.getId());
        this.tournament.setName(shortTournamentDto.getName());
    }

    public void setActiveMatch(ActiveMatch activeMatch){
        this.match = new Match();
        this.match.setMatch_id(activeMatch.getMatchId());
    }
    // Getters y setters
    public Long getId() {
        return statisticsId;
    }

    public void setId(Long statisticsId) {
        this.statisticsId = statisticsId;
    }


    public Tournament getTournament(){
        return tournament;
    }

    public void setShortTournamentDto(Tournament tournament){
        this.tournament = tournament;
    }

    public Integer getTeam1Score(){
        return team1Score;
    }

    public void setTeam1Score(Integer team1Score) {
        this.team1Score = team1Score;
    }

    public Integer getTeam2Score(){
        return team2Score;
    }

    public void setTeam2Score(Integer team2Score) {
        this.team2Score = team2Score;
    }

    // TODO: Tene cuidado con esto, castealo a TeamDto, cualquier cosa. Sino puede provocarse el infinitiveRecursion

    public Team getGanador(){
        return ganador;
    }


    public void setGanador(TeamWinnerPointsDto ganadorDto) {
        this.ganador = new Team();
        this.ganador.setId(ganadorDto.getId());
        this.ganador.setName(ganadorDto.getName());
    }
}
