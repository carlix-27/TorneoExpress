package com.TorneosExpress.dto.tournament;

import java.util.List;

public class ActiveMatchesFixtureDto {
    private List<ShortMatchDto> matches;

    public List<ShortMatchDto> getMatches() {
        return matches;
    }

    public void setMatches(List<ShortMatchDto> matches) {
        this.matches = matches;
    }
}
