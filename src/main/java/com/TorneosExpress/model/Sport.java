package com.TorneosExpress.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Sport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sport_Id")
    private Long sportId;

    @Column(unique = true, name = "NAME")
    private String sportName;

    @Column
    private int num_players;

    public Sport(){}

}