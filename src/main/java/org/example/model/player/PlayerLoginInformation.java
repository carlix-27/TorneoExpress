package org.example.model.player;

import org.example.model.Guest.LoginResult;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Map;
import java.util.List;

@Entity
public class PlayerLoginInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long player_id;

    @Column(nullable = false, unique = true)
    private String player_email;

    @Column
    private String player_password;


    public LoginResult login(String email, String password) {
        return null;
    }

    public void register(String email, String password) {

    }
}
