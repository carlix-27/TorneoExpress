package com.TorneosExpress.service;

import com.TorneosExpress.dto.ActiveMatch;
import com.TorneosExpress.dto.ShortTournamentDto;
import com.TorneosExpress.dto.StatisticsDto;
import com.TorneosExpress.model.Statistics;
import com.TorneosExpress.repository.MatchRepository;
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

    @Autowired
    private MatchRepository matchRepository;

    public boolean saveStatistics(Long match_id, Long tournamentId, StatisticsDto statisticsDto) {
        ShortTournamentDto shortTournamentDto = tournamentRepository.findById(tournamentId)
                .map(tournament -> new ShortTournamentDto(
                        tournament.getId(),
                        tournament.getName()
                )).orElse(null);

        if(shortTournamentDto == null){
            return false;
        }

        ActiveMatch activeMatch = matchRepository.findById(match_id)
                .map(match -> new ActiveMatch(match.getMatch_id(),
                        match.getTeam1_id(),
                        match.getTeam2_id(),
                        match.getTournament_id(),
                        match.getTeamName1(),
                        match.getTeamName2()
                )).orElse(null);

        if(activeMatch == null){
            return false;
        }

        Statistics statistics = new Statistics();
        statistics.setShortTournamentDto(shortTournamentDto);
        statistics.setActiveMatch(activeMatch);
        statistics.setResultadoPartido(statisticsDto.getResultadoPartido());
        statistics.setGanador(statisticsDto.getGanador());
        statisticsRepository.save(statistics);
        return true;
    }
}
