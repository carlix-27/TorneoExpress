package com.TorneosExpress.fixture;

import com.TorneosExpress.dto.ActiveMatch;


import java.util.List;

public class ActiveMatchFixture {
    private List<ActiveMatch> matches;

    public ActiveMatchFixture(List<ActiveMatch> matches) {
        this.matches = matches;
    }

    public List<ActiveMatch> getMatches() {
        return matches;
    }
}
