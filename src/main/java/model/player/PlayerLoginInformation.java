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

    public PlayerLoginInformation(){}

    @Transient
    private EntityManager entityManager;


    public LoginResult login(String email, String password) {
        LoginResult loginResult = new LoginResult();
        if (email.equals(player_email) && password.equals(player_password)) {
            loginResult.successful();
        }
        return loginResult;
    }

    public void register(String email, String password) {
        // Check if the email already exists in the database
        PlayerLoginInformation existingPlayer = entityManager.createQuery(
                        "SELECT p FROM PlayerLoginInformation p WHERE p.player_email = :email", PlayerLoginInformation.class)
                .setParameter("email", email)
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);

        // If the email doesn't exist, proceed with registration
        if (existingPlayer == null) {
            this.player_email = email;
            this.player_password = password;
            entityManager.persist(this);
        } else {
            // Handle duplicate email error (log error)
            System.err.println("Email already exists: " + email);
        }
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
