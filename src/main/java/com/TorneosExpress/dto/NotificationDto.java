package com.TorneosExpress.dto;

public class NotificationDto {

    private Long inviteId;
    private Long toId;
    private String message;


    public NotificationDto() {
    }

    public NotificationDto(Long toId, String message) {
        this.toId = toId;
        this.message = message;
    }

    public Long getToId() {
        return toId;
    }

    public Long getInviteId() {
        return inviteId;
    }

    public String getMessage() {
        return message;
    }


}
