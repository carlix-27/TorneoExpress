package com.TorneosExpress.repository;

import com.TorneosExpress.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
  public Team findById(long id);

  public List<Team> findByCaptainId(Long captainId);

  public List<Team> findByName(String name);
}
