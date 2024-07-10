package com.TorneosExpress.dto.team;

import com.TorneosExpress.model.Sport;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CreateTeamDto {

  private String name;
  private Long captainId;
  private Sport sport;
  private String location;
  private boolean isPrivate;

}
