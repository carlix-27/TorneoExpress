package org.example.model.player;

import javax.persistence.*;

@Entity
public class PlayerLoginInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String player_email;

    @Column
    private String player_password;
}
