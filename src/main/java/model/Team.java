package model;

import model.player.Player;
import model.shop.Article;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Team {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Long teamId;

  @Column
  private String teamName;

  @Column
  private String teamLocation;

  @Column
  private Privacy teamPrivacy;

  @Column
  private int prestigePoints;

  @ManyToOne
  private Player captain;

  @ManyToMany
  private List<Player> players = new ArrayList<>();

  @ManyToMany
  private List<Article> articles = new ArrayList<>();

  public Team(String teamName, String teamLocation, Privacy teamPrivacy, Player captain) {
    this.teamName = teamName;
    this.teamLocation = teamLocation;
    this.teamPrivacy = teamPrivacy;
    this.captain = captain;
    this.prestigePoints = 0;
  }

  public Team() { }

  public void join(Player player) {
    if (this.teamPrivacy == Privacy.PUBLIC) {
      players.add(player);
    } else {
      requestAccess(player);
    }
  }

  private void requestAccess(Player player) {

  }

  public void joinTournament(Tournament tournament) {
    tournament.joinTournament(this);
  }

  public void leaveTournament(Tournament tournament) {
    tournament.leave(this);
  }

  public void buyArticle(Article article) {
    articles.add(article);
  }

  public Player getCaptain() {
    return this.captain;
  }

  public void addPrestigePoints(int prestigePoints) {
    this.prestigePoints += prestigePoints;
  }

}
