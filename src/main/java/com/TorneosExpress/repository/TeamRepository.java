package com.TorneosExpress.repository;

import com.TorneosExpress.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
  public List<Team> findByName(String name);
}
