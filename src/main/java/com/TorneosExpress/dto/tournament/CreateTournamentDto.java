package com.TorneosExpress.dto.tournament;

import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Type;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateTournamentDto {
    private Long creatorId;
    private String name;
    private String location;
    private LocalDate date;
    private Sport sport;
    private Boolean isPrivate;
    private Difficulty difficulty;
    private int maxTeams;
    private Type type;
}
