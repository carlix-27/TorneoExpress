package com.TorneosExpress.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
public class Player {

    public Player(String name, String location, String email, String password) {
        this.name = name;
        this.location = location;
        this.email = email;
        this.password = password;
        this.is_Premium = false;
        this.is_Captain = false;
        this.is_Enabled = false;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "LOCATION")
    private String location;

    @Column(name = "EMAIL", unique = true)
    private String email;

    @Column(name = "IS_PREMIUM")
    private Boolean is_Premium;

    @Column(name = "IS_ENABLED")
    private Boolean is_Enabled;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "IS_CAPTAIN")
    private boolean is_Captain;

    @ManyToMany(mappedBy = "players")
    @JsonIgnore
    private List<Team> teams = new ArrayList<>();

    public Player() {}

}
