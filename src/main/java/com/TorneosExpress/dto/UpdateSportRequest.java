package com.TorneosExpress.dto;

public class UpdateSportRequest {
    private Long id;
    private String new_name;
    private int new_num_players;

    public Long getId(){
        return id;
    }

    public String getNew_name(){return new_name;}

    public int getNew_num_players(){
        return new_num_players;
    }
}