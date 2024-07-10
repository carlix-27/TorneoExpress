package com.TorneosExpress.dto.tournament;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TournamentRequestDto {

    private Long requestFrom;
    private Long requestTo;
    private Long teamId;
    private String teamName;
    private Long tournamentId;
    private Boolean accepted;
    private Boolean denied;

}
