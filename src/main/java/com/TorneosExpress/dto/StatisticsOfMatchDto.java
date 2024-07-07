package com.TorneosExpress.dto;

public class StatisticsOfMatchDto {
    // Interesa, id de la estadistica
    // resultado y ganador
    private Long matchId;
    private Long statisticsId;
    private String resultadoPartido;
    private String ganador;

    // La idea de esto, es mediante el statisticsId que tiene asociado cada partido, devolver en "Ver Estadisticas"
    // Getters y setters
    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long matchId) {
        this.matchId = matchId;
    }

    public Long getStatisticsId() {
        return statisticsId;
    }

    public void setStatisticsId(Long statisticsId) {
        this.statisticsId = statisticsId;
    }

    public String getResultadoPartido() {
        return resultadoPartido;
    }

    public void setResultadoPartido(String resultadoPartido) {
        this.resultadoPartido = resultadoPartido;
    }

    public String getGanador() {
        return ganador;
    }

    public void setGanador(String ganador) {
        this.ganador = ganador;
    }

}
