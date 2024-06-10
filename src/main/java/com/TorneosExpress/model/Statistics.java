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
    private ShortTournamentDto shortTournamentDto;
    private String resultadoPartido;
    private String posesionBalon;
    private String tirosAlArco;
    private String tirosAPuerta;
    private String faltas;

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
    public ShortTournamentDto getTournament(){
        return shortTournamentDto;
    }

    public void setShortTournamentDto(ShortTournamentDto shortTournamentDto){
        this.shortTournamentDto = shortTournamentDto;
    }


    public String getResultadoPartido() {
        return resultadoPartido;
    }

    public void setResultadoPartido(String resultadoPartido) {
        this.resultadoPartido = resultadoPartido;
    }

    public String getPosesionBalon() {
        return posesionBalon;
    }

    public void setPosesionBalon(String posesionBalon) {
        this.posesionBalon = posesionBalon;
    }

    public String getTirosAlArco() {
        return tirosAlArco;
    }

    public void setTirosAlArco(String tirosAlArco) {
        this.tirosAlArco = tirosAlArco;
    }

    public String getTirosAPuerta() {
        return tirosAPuerta;
    }

    public void setTirosAPuerta(String tirosAPuerta) {
        this.tirosAPuerta = tirosAPuerta;
    }

    public String getFaltas() {
        return faltas;
    }

    public void setFaltas(String faltas) {
        this.faltas = faltas;
    }
}
