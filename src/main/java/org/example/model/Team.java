package org.example.model;

import org.example.model.player.Player;
import org.example.model.shop.Article;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Team {

  @Id
  private Long team_id;

  @Column
  private String team_name;

  @Column
  private String team_location;

  @Column
  private TeamPrivacy team_privacy;

  @Column
  private int prestige_points;

  @ManyToOne
  private Captain captain;

  @ManyToMany
  private List<Player> players = new ArrayList<>();

  @ManyToMany
  private List<Article> articles = new ArrayList<>();


  public void join(Player player) {
    players.add(player);
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
}
