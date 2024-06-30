package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match;

import java.util.List;

public class ActiveMatchFixture {
    private List<Match> matches;

    public ActiveMatchFixture(List<Match> matches) {
        this.matches = matches;
    }

    public List<Match> getMatches() {
        return matches;
    }
}
