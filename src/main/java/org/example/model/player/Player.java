package org.example.model.player;


import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

public class Player {

    @OneToOne(mappedBy = "id")
    private long player_id;

    @OneToOne
    @JoinColumn(name = "player_email")
    private String player_email;

}
