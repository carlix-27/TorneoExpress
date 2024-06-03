package com.TorneosExpress.dto;

public class NotificationDto {

    private Long recipientId;
    private String message;

    public NotificationDto() {
    }

    public NotificationDto(Long recipientId, String message) {
        this.recipientId = recipientId;
        this.message = message;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
