package com.TorneosExpress.dto;

public class StatisticsDto {
    private String resultadoPartido;
    private String posesionBalon;
    private String tirosAlArco;
    private String tirosAPuerta;
    private String faltas;

    // Getters y setters
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
