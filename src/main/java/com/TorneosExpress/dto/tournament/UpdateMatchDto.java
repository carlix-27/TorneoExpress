package com.TorneosExpress.dto.tournament;

import com.TorneosExpress.model.Team;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateMatchDto {
  private Team team1;
  private Team team2;
  private String location;
  private LocalDate date;
}
