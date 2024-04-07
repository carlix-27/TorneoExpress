package com.TorneosExpress.model.Guest;

import com.TorneosExpress.model.player.PlayerLoginInformation;
import com.TorneosExpress.model.player.Player;
import jakarta.persistence.*;


public class Guest{


  public LoginResult login(String email, String password) {
    PlayerLoginInformation pli = new PlayerLoginInformation();
    return pli.login(email, password);
  }

  public void register(String name, String location, String email, String password) {
    PlayerLoginInformation pli = new PlayerLoginInformation();
    Player player = new Player(name, location, email);
    pli.register(email, password);
  }
}
