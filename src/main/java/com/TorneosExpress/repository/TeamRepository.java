package com.TorneosExpress.repository;

import com.TorneosExpress.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
  Team findById(long id);

  List<Team> findByCaptainId(Long captainId);

  List<Team> findByName(String name);

  @Query("SELECT t FROM Team t JOIN t.players p WHERE p.id = :userId")
  List<Team> findByMemberId(@Param("userId") Long userId);
}
