package model.admin;

import javax.persistence.*;

public class Administrator {

    @OneToOne(mappedBy = "id")
    private long admin_id;

    @OneToOne
    @JoinColumn(name = "admin_email")
    private String admin_mail;

    @Column
    private String AdminName;

    public void createTournament() {

    }

    public void uodateRanking() {

    }

}
