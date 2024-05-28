package com.TorneosExpress.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private Player recipient;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Constructors, getters, and setters...

    public Notification() {
    }

    public Notification(Player recipient, String message) {
        this.recipient = recipient;
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters...
}
