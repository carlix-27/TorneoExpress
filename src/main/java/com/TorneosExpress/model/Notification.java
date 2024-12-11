package com.TorneosExpress.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long toId;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean read;

    @Column(nullable = false)
    private String redirectUrl;

    public Notification() {
    }

    public Notification(Long toId, String message, String url) {
        this.toId = toId;
        this.message = message;
        this.createdAt = LocalDateTime.now();
        this.read = false;
        this.redirectUrl = url;
    }
}
