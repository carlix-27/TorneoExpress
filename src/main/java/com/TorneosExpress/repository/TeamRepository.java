package com.TorneosExpress.repository;

import com.TorneosExpress.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
  Team findById(long id);

  List<Team> findByCaptainId(Long captainId);

  List<Team> findByName(String name);
}
