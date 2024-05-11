package com.TorneosExpress.model;


import jakarta.persistence.*;

@Entity
public class Sport {

    public Sport(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "sport_Id")
    private Long sportId;

    @Column(unique = true)
    private String sportName;

    @Column
    private int num_players;

    // Getters y Setters
    public Long getSportId(){ return sportId;}

    public String getSportName(){ return sportName;}

    public int getNum_players(){ return num_players;}

    public void setSport(String sportName){
        this.sportName = sportName;
    }

    public void setNumPlayers(int num_players){
        this.num_players = num_players;
    }

    public String toString() {
        return sportName;
    }

}