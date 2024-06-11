package com.TorneosExpress.service;

import com.TorneosExpress.dto.ShortTournamentDto;
import com.TorneosExpress.dto.StatisticsDto;
import com.TorneosExpress.model.Statistics;
import com.TorneosExpress.repository.StatisticsRepository;
import com.TorneosExpress.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    @Autowired
    private StatisticsRepository statisticsRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    public boolean saveStatistics(Long tournamentId, StatisticsDto statisticsDto) {
        ShortTournamentDto shortTournamentDto = tournamentRepository.findById(tournamentId)
                .map(tournament -> new ShortTournamentDto(
                        tournament.getId(),
                        tournament.getName()
                )).orElse(null);

        if(shortTournamentDto == null){
            return false;
        }
        Statistics statistics = new Statistics();
        statistics.setShortTournamentDto(shortTournamentDto);
        statistics.setResultadoPartido(statisticsDto.getResultadoPartido());
        statistics.setGanador(statisticsDto.getGanador());
        statisticsRepository.save(statistics);
        return true;
    }
}
