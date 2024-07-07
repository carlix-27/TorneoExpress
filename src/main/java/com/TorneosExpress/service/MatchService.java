package com.TorneosExpress.service;

import com.TorneosExpress.dto.StatisticsOfMatchDto;
import com.TorneosExpress.model.Match;
import com.TorneosExpress.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MatchService {
    /*@Autowired
    private MatchRepository matchRepository;

    public StatisticsOfMatchDto getStatisticsOfMatch(Long statisticsId) {
        Match matchWithAddedStatistics = matchRepository.findMatchByStatisticId(statisticsId);

        StatisticsOfMatchDto statisticsOfMatchDto = new StatisticsOfMatchDto();
        statisticsOfMatchDto.setStatisticsId(matchWithAddedStatistics.getStatisticId());
        statisticsOfMatchDto.setResultadoPartido(matchWithAddedStatistics.getResultadoPartidoOfMatch());
        statisticsOfMatchDto.setGanador(matchWithAddedStatistics.getGanadorOfMatch());
        return statisticsOfMatchDto;
    }*/
}
