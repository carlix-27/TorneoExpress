package model.admin;

import javax.persistence.*;

@Entity
public class AdminLoginInformation {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long admin_id;


    @Column(nullable = false, unique = true)
    private String admin_email;

    @Column
    private String admin_password;

}
