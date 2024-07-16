package com.TorneosExpress.dto.tournament;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SaveMatchStatsDto {
    private int team1Score;
    private int team2Score;
    private Long winner;
    private List<ArticleUsageDto> articleUsageDtos;
}

