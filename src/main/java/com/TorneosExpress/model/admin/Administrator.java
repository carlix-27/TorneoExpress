package com.TorneosExpress.model.admin;

import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import jakarta.persistence.Entity;

import jakarta.persistence.*;

import java.util.NoSuchElementException;


@Entity
public class Administrator {


    @Id
    private long admin_id;

    @Column
    private String admin_mail;

    @Column
    private String admin_name;


    public Administrator() {

    }
    

}
