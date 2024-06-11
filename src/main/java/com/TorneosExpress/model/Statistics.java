package com.TorneosExpress.model;

import com.TorneosExpress.dto.ShortTournamentDto;
import com.TorneosExpress.dto.TournamentDto;
import jakarta.persistence.*;

@Entity
public class Statistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    /*@ManyToOne // Fijate acá de laburar con Dtos, a lo mejor laburar con la entidad entera puede traer demasiados problemas!
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;*/
    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    private String resultadoPartido;
    private String ganador;


    public void setTournament(Tournament tournament){
        this.tournament = tournament;
    }

    public void setShortTournamentDto(ShortTournamentDto shortTournamentDto){
        this.tournament = new Tournament();
        this.tournament.setId(shortTournamentDto.getId());
        this.tournament.setName(shortTournamentDto.getName());
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
