package org.example.model;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("CAPTAIN")
public class Captain extends User{

  public Captain(){

  }
  public Captain(String name, String email, String password){
    super(name, email, password, Role.CAPTAIN);
  }

  public void acceptPlayer() {

  }

  public void eliminateTeam() {

  }
}
