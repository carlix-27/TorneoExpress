package com.TorneosExpress.service;

import com.TorneosExpress.dto.ActiveMatch;
import com.TorneosExpress.dto.ShortTournamentDto;
import com.TorneosExpress.dto.StatisticsDto;
import com.TorneosExpress.dto.team.TeamPointsDto;
import com.TorneosExpress.dto.team.TeamWinnerPointsDto;
import com.TorneosExpress.model.Statistics;
import com.TorneosExpress.repository.MatchRepository;
import com.TorneosExpress.repository.StatisticsRepository;
import com.TorneosExpress.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

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
                        match.getTournamentId(),
                        match.getTeamName1(),
                        match.getTeamName2()
                )).orElse(null);

        if(activeMatch == null){
            return false;
        }

        Optional<Statistics> existingStatisticsOptional = statisticsRepository.findByMatch_matchIdAndTournament_Id(match_id, tournamentId);

        if(existingStatisticsOptional.isPresent()){
            // Actualizar estadisticas existentes
            Statistics existingStatistics = existingStatisticsOptional.get();
            existingStatistics.setTeam1Score(statisticsDto.getTeam1Score());
            existingStatistics.setTeam2Score(statisticsDto.getTeam2Score());
            TeamWinnerPointsDto teamWinner = statisticsDto.getWinner();
            if(teamWinner != null){
                int points = determineScore(statisticsDto.getTeam1Score(), statisticsDto.getTeam2Score());
                teamWinner.setPrestigePoints(points);
                TeamPointsDto teamPointsDto = new TeamPointsDto(points);
                teamPointsDto.setPrestigePoints(points); // Ver la parte del get
                existingStatistics.setTeamWinnerPointsDto(teamWinner);
            }

            statisticsRepository.save(existingStatistics); // Se sobreescribe la informacion (se edita de alguna forma)
            // TODO: Evalua por front, que cuando esto ocurra, informe por web 'Estadisticas actualizadas'
        } else{
            // Crear nuevas estadisticas
            Statistics statistics = new Statistics();
            statistics.setShortTournamentDto(shortTournamentDto);
            statistics.setActiveMatch(activeMatch);
            statistics.setTeam1Score(statisticsDto.getTeam1Score());
            statistics.setTeam2Score(statisticsDto.getTeam2Score());
            statistics.setTeamWinnerPointsDto(statisticsDto.getWinner());
            statisticsRepository.save(statistics);
        }

        return true;
    }


    private int determineScore(int team1Score, int team2Score) {
        if (team1Score > team2Score) {
            return 30;
        } else if (team1Score == team2Score) {
            return 15;
        } else {
            return 0;
        }
    }


    public StatisticsDto getStatistics(Long match_id){
        Statistics statistics = statisticsRepository.findByMatch_matchId(match_id);

        if(statistics == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Las estadisticas de este partido no existen todavia.");
        }

        return new StatisticsDto(statistics.getWinner().teamWinnerPointsDto(), statistics.getTeam1Score(), statistics.getTeam2Score());
    }
}
