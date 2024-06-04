package com.TorneosExpress.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long from;

    @Column
    private Long to;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean accepted;

    @Column
    private Long team;

    public Invite() {
    }

    public Invite(Long from, Long invitee, Long team) {
        this.from = from;
        this.to = invitee;
        this.team = team;
        this.createdAt = LocalDateTime.now();
        this.accepted = false;
    }

    // Getters and setters...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFrom() {
        return from;
    }

    public void setFrom(Long inviter) {
        this.from = inviter;
    }

    public Long getTo() {
        return to;
    }

    public void setTo(Long invitee) {
        this.to = invitee;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public Long getTeam() {
        return team;
    }

    public void setTeam(Long team) {
        this.team = team;
    }
}
