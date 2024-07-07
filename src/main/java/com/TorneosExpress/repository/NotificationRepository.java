package com.TorneosExpress.repository;


import com.TorneosExpress.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByToIdAndReadFalse(Long toId);
    List<Notification> findByToId(Long toId);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true WHERE n.toId = :toId AND n.read = false")
    void markAllAsReadByToId(@Param("toId") Long toId);
}
