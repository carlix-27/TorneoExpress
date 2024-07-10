package com.TorneosExpress.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class Statistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statisticsId;

    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @OneToOne
    @JoinColumn(name = "matchId", nullable = false)
    private Match match;

    private Integer team1Score;
    private Integer team2Score;

    @OneToOne
    @JoinColumn(name = "id", nullable = false)
    private Team ganador;

}
