package com.TorneosExpress.repository;

import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.model.TournamentTeam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentTeamRepository extends JpaRepository<TournamentTeam, Long> {
    TournamentTeam findByTeamAndTournament(Team team, Tournament tournament);
    TournamentTeam findByTournamentPointsAndTournament(Integer tournamentPoints, Tournament tournament);
}
