package com.TorneosExpress.model;

import jakarta.persistence.*;

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


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequestFrom() {
        return requestFrom;
    }

    public void setRequestFrom(Long request_from) {
        this.requestFrom = request_from;
    }

    public Long getRequestTo() {
        return requestTo;
    }

    public void setRequestTo(Long request_to) {
        this.requestTo = request_to;
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
