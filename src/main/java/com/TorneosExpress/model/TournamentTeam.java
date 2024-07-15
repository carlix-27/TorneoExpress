package com.TorneosExpress.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "TOURNAMENT_TEAMS")
public class TournamentTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @Column
    private Integer tournamentPoints = 0;

    public void addPoints(Integer points) {
        if (this.tournamentPoints == null) {
            this.tournamentPoints = 0;
        }
        this.tournamentPoints += points;
    }

}