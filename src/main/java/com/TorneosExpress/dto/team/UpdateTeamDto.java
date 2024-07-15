package com.TorneosExpress.dto.team;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTeamDto {
    private String name;
    private Boolean isPrivate;
}
