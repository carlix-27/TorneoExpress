package model.player;

import model.Guest.LoginResult;

import javax.persistence.*;

@Entity
public class PlayerLoginInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long player_id;

    @Column(nullable = false, unique = true)
    private String player_email;

    @Column(nullable = false)
    private String player_password;

    public LoginResult login(String email, String password) {
        LoginResult loginResult = new LoginResult();

        // Check if the provided email and password match the stored credentials
        if (email.equals(player_email) && password.equals(player_password)) {
            loginResult.successful(); // Set the login result as successful
        }

        return loginResult;
    }

    public void register(String email, String password) {
        this.player_email = email;
        this.player_password = password;
    }

    // Getters and setters
    public Long getPlayer_id() {
        return player_id;
    }

    public void setPlayer_id(Long player_id) {
        this.player_id = player_id;
    }

    public String getPlayer_email() {
        return player_email;
    }

    public void setPlayer_email(String player_email) {
        this.player_email = player_email;
    }

    public String getPlayer_password() {
        return player_password;
    }

    public void setPlayer_password(String player_password) {
        this.player_password = player_password;
    }
}
