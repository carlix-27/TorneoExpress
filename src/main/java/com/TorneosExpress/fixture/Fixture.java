package com.TorneosExpress.fixture;

import com.TorneosExpress.model.Match;
import jakarta.persistence.Embeddable;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Embeddable
public class Fixture {

  @OneToMany
  private List<Match> matches;


}
