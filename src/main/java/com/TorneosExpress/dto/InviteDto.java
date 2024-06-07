package com.TorneosExpress.dto;

import java.time.LocalDateTime;

public class InviteDto {

    private Long id;
    private Long invite_from;
    private Long invite_to;
    private Long teamId;
    private LocalDateTime createdAt = LocalDateTime.now();

    public InviteDto() {
    }

    public InviteDto(Long invite_from, Long invite_to, Long teamId) {
        this.invite_from = invite_from;
        this.invite_to = invite_to;
        this.teamId = teamId;
    }

    public Long getInvite_from() {
        return invite_from;
    }

    public void setInvite_from(Long invite_from) {
        this.invite_from = invite_from;
    }

    public Long getInvite_to() {
        return invite_to;
    }

    public void setInvite_to(Long invite_to) {
        this.invite_to = invite_to;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
