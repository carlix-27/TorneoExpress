package com.TorneosExpress.dto.tournament;

import com.TorneosExpress.model.Difficulty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTournamentDto {
    private String name;
    private String location;
    private Boolean isPrivate;
    private Difficulty difficulty;
}
