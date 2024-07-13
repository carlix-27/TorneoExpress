package com.TorneosExpress.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FROM_ID")
    private Long inviteFrom;

    @Column(name = "TO_ID")
    private Long inviteTo;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean accepted;

    @Column
    private boolean denied;

    @Column
    private Long team;


    public Invite() {
    }

    public Invite(Long from, Long invitee, Long team) {
        this.inviteFrom = from;
        this.inviteTo = invitee;
        this.team = team;
        this.createdAt = LocalDateTime.now();
        this.accepted = false;
    }
}
