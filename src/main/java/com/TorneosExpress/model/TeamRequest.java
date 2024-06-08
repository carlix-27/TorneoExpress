package com.TorneosExpress.model;

import jakarta.persistence.*;

@Entity
public class TeamRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FROM_ID")
    private Long request_from;

    @Column(name = "TO_ID")
    private Long request_to;

    @Column
    private Long teamId;

    @Column(nullable = false)
    private boolean accepted;

    @Column(nullable = false)
    private boolean denied;

    @Column
    private boolean sent;


    public TeamRequest(){}

    public TeamRequest(Long request_from, Long request_to, Long teamId) {
        this.request_from = request_from;
        this.request_to = request_to;
        this.teamId = teamId;
        this.accepted = false;
        this.denied = false;
        this.sent = true;
    }


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

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }
}
