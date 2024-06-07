package com.TorneosExpress.repository;


import com.TorneosExpress.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByToIdAndReadFalse(Long toId);
    List<Notification> findByReadFalse();
}
