package com.TorneosExpress.dto;

public class StatisticsDto {
    private String resultadoPartido;
    private String ganador;

    public StatisticsDto(String resultadoPartido, String ganador){
        this.resultadoPartido = resultadoPartido;
        this.ganador = ganador;
    }

    public StatisticsDto(){}

    // Getters y setters
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
