package model.Guest;

import model.player.PlayerLoginInformation;
import model.player.Player;

public class Guest {

  public LoginResult login(String email, String password) {
    PlayerLoginInformation pli = new PlayerLoginInformation() ;
    return pli.login(email, password);
  }

  public void register(String name, String location, String email, String password) {
    PlayerLoginInformation pli = new PlayerLoginInformation();
    Player player = new Player(name, location, email);
    pli.register(email, password);
  }
}
