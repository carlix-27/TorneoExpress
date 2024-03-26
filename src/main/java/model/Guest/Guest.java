package model.Guest;

import model.player.PlayerLoginInformation;

public class Guest {

  public void login(String email, String password) {
    PlayerLoginInformation pli = new PlayerLoginInformation();
    pli.login(email, password);
  }

  public void register(String name, String location, String email, String password) {

  }
}
