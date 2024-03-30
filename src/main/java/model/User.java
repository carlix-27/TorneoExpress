package model;

import com.google.gson.Gson;

import javax.persistence.*;


@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(discriminatorType = DiscriminatorType.STRING) // Ver si el error está en el Persistence, chequeate el código del profe!
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(nullable = false, unique = true)
    protected String email;

    @Column(nullable = false)
    protected String name;

    @Column(nullable = false)
    protected String password;

    @Enumerated(EnumType.STRING)
    protected Role role;

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public User() {
        // Default constructor
    }

    public static UserBuilder create(String email) {
        return new UserBuilder(email);
    }


    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private User(UserBuilder builder) {
        this.password = builder.password;
        this.email = builder.email;
    }

    public static User fromJson(String json) {
        final Gson gson = new Gson();
        return gson.fromJson(json, User.class);
    }

    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }


    public static class UserBuilder {
        private final String email;
        private String password;

        public UserBuilder(String email) {
            this.email = email;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public User build() {
            return new User(this);
        }

    }

}
