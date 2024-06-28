package com.TorneosExpress.dto;

public class StatisticsDto {
    private String resultadoPartido;
    private String ganador;

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
