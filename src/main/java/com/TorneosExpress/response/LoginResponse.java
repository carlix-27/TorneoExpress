package com.TorneosExpress.response;

import com.TorneosExpress.dto.PlayerDto;

public class LoginResponse {
    private PlayerDto playerDto;
    private String sessionId;

    public LoginResponse(PlayerDto playerDto, String sessionId) {
        this.playerDto = playerDto;
        this.sessionId = sessionId;
    }

    public PlayerDto getPlayerDto() {
        return playerDto;
    }

    public void setPlayerDto(PlayerDto playerDto) {
        this.playerDto = playerDto;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}

