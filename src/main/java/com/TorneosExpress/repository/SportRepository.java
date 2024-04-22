package com.TorneosExpress.repository;

import com.TorneosExpress.model.Sport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SportRepository extends JpaRepository<Sport, Long> {
    Sport findBySportId(Long id);
}