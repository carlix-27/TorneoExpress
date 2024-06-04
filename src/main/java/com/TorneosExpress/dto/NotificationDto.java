package com.TorneosExpress.dto;

public class NotificationDto {

    private Long fromId;
    private Long toId;
    private String message;

    public NotificationDto() {
    }

    public NotificationDto(Long recipientId, String message) {
        this.toId = recipientId;
        this.message = message;
    }

    public Long getRecipientId() {
        return toId;
    }

    public void setRecipientId(Long recipientId) {
        this.toId = recipientId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getFromId() {
        return fromId;
    }

    public void setFromId(Long fromId) {
        this.fromId = fromId;
    }
}
