package com.TorneosExpress.model;

import jakarta.persistence.*;

@Entity
public class TournamentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FROM_ID")
    private Long request_from;

    @Column(name = "TO_ID")
    private Long request_to;

    @Column(nullable = false)
    private boolean accepted;

    @Column(nullable = false)
    private boolean denied;

    @Column
    private Long tournamentId;


    public TournamentRequest(){}


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequest_from() {
        return request_from;
    }

    public void setRequest_from(Long request_from) {
        this.request_from = request_from;
    }

    public Long getRequest_to() {
        return request_to;
    }

    public void setRequest_to(Long request_to) {
        this.request_to = request_to;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public boolean isDenied() {
        return denied;
    }

    public void setDenied(boolean denied) {
        this.denied = denied;
    }

    public Long getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(Long tournamentId) {
        this.tournamentId = tournamentId;
    }


}
