package com.TorneosExpress.model;

import com.TorneosExpress.dto.ActiveMatch;
import com.TorneosExpress.dto.ShortTournamentDto;
import jakarta.persistence.*;

@Entity
public class Statistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statisticsId;


    /*@ManyToOne // Fijate acá de laburar con Dtos, a lo mejor laburar con la entidad entera puede traer demasiados problemas!
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;*/
    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @OneToOne
    @JoinColumn(name = "matchId", nullable = false)
    private Match match;


    private String resultadoPartido;
    private String ganador;


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

    /*public Tournament getTournament() {
        return tournament;
    }*/

    /*public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }*/
    public Tournament getTournament(){
        return tournament;
    }

    public void setShortTournamentDto(Tournament tournament){
        this.tournament = tournament;
    }


    public String getResultadoPartido() {
        return resultadoPartido;
    }

    public void setResultadoPartido(String resultadoPartido) {
        this.resultadoPartido = resultadoPartido;
    }


    public String getGanador(){
        return ganador;
    }

    public void setGanador(String ganador){
        this.ganador = ganador;
    }
}
