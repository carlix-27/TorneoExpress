package org.example.model.Guest;

import org.example.model.player.PlayerLoginInformation;

import javax.persistence.Entity;

public class Guest {

  public void login(String email, String password) {
    PlayerLoginInformation pli = new PlayerLoginInformation();
    pli.login(email, password);
  }
}
