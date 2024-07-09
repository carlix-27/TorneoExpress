package com.TorneosExpress.dto.tournament;

import com.TorneosExpress.model.Match;
import java.util.List;

public class Fixture {
    private final List<Match> matches;

    public Fixture(List<Match> matches) {
        this.matches = matches;
    }

    public List<Match> getMatches() {
        return matches;
    }
}