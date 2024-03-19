package org.example.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Captain {

  @Id
  private Long captain_id;

  @Column
  private String captain_name;

  public void acceptPlayer() {

  }

  public void eliminateTeam() {

  }
}
