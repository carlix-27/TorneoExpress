package com.TorneosExpress.service;

import com.TorneosExpress.dto.StatisticsDto;
import com.TorneosExpress.model.Match;
import com.TorneosExpress.model.Statistics;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.repository.MatchRepository;
import com.TorneosExpress.repository.StatisticsRepository;
import com.TorneosExpress.repository.TeamRepository;
import com.TorneosExpress.repository.TournamentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class StatisticsService {

    private final StatisticsRepository statisticsRepository;

    private final TournamentRepository tournamentRepository;

    private final MatchRepository matchRepository;

    private final TeamRepository teamRepository;

    @Autowired
    public StatisticsService(StatisticsRepository statisticsRepository, TournamentRepository tournamentRepository, MatchRepository matchRepository, TeamRepository teamRepository) {
        this.statisticsRepository = statisticsRepository;
        this.tournamentRepository = tournamentRepository;
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
    }

    public Statistics saveStatistics(Long match_id, Long tournamentId, StatisticsDto statisticsDto) {

        Tournament tournament = getTournament(tournamentId);
        Match match = getMatch(match_id);
        Team winner = getWinnerTeam(statisticsDto.getWinner());

        match.setWinner(winner.getId());
        match.setPlayed(true);

        Statistics statistics = new Statistics();
        statistics.setTournament(tournament);
        statistics.setMatch(match);
        statistics.setTeam1Score(statisticsDto.getTeam1Score());
        statistics.setTeam2Score(statisticsDto.getTeam2Score());
        statistics.setWinner(winner);


        matchRepository.save(match);
        return statisticsRepository.save(statistics);
    }

    private Match getMatch(Long match_id) {
        Optional<Match> matchOptional = matchRepository.findById(match_id);
        if (matchOptional.isEmpty()) {
            throw new EntityNotFoundException("Match not found with id " + match_id);
        }
        return matchOptional.get();
    }

    private Tournament getTournament(Long tournamentId) {
        Optional<Tournament> tournamentOptional = tournamentRepository.findById(tournamentId);
        if (tournamentOptional.isEmpty()) {
            throw new EntityNotFoundException("Tournament not found with id " + tournamentId);
        }
        return tournamentOptional.get();
    }


    private Team getWinnerTeam(Long winnerTeamId) {
        return teamRepository.findById(winnerTeamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id " + winnerTeamId));
    }


    public StatisticsDto getStatistics(Long match_id){
        Statistics statistics = statisticsRepository.findByMatch_matchId(match_id);

        if(statistics == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Las estadisticas de este partido no existen todavia.");
        }

        Team winner = statistics.getWinner();
        Long winnerId = winner.getId();
        return new StatisticsDto(winnerId, statistics.getTeam1Score(), statistics.getTeam2Score());
    }
}
