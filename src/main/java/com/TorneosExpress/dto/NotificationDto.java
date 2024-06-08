package com.TorneosExpress.dto;

public class NotificationDto {

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

    public String getMessage() {
        return message;
    }

}
