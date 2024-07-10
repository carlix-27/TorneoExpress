package com.TorneosExpress.dto.team;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TeamRequestDto {

    private Long requestFrom;
    private Long requestTo;
    private Long teamId;
    private Boolean accepted;
    private Boolean denied;
    private String name;
    private Boolean sent;

}
