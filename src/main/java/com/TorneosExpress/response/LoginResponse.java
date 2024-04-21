package com.TorneosExpress.response;

import com.TorneosExpress.dto.PlayerDto;

public class LoginResponse {
    private PlayerDto playerDto;
    private String sessionId;
    private Long userID;


    public LoginResponse(PlayerDto playerDto, String sessionId, long id) {
        this.playerDto = playerDto;
        this.sessionId = sessionId;
        this.userID = id;
    }

    public PlayerDto getPlayerDto() {
        return playerDto;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
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

