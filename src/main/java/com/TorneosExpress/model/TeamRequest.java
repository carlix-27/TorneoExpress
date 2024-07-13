package com.TorneosExpress.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class TeamRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FROM_ID")
    private Long requestFrom;

    @Column(name = "TO_ID")
    private Long requestTo;

    @Column
    private String name;

    @Column
    private Long teamId;

    @Column(nullable = false)
    private boolean accepted;

    @Column(nullable = false)
    private boolean denied;

    @Column
    private boolean sent;

    public TeamRequest(){}

    public TeamRequest(Long requestFrom, Long requestTo, Long teamId, String name) {
        this.requestFrom = requestFrom;
        this.requestTo = requestTo;
        this.teamId = teamId;
        this.name = name;
        this.accepted = false;
        this.denied = false;
        this.sent = true;
    }


}
