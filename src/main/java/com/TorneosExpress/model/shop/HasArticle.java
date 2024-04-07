package com.TorneosExpress.model.shop;


import jakarta.persistence.*;
import java.util.HashMap;
import java.util.Map;

public class HasArticle {

  @Column
  private Long team_id;

  @Column
  private Long article_id;

  @ManyToMany
  // Order: team_id, article_id.
  private Map<Long, Long> purchases = new HashMap<>();

  public void newPurchase(Long team_id, Long article_id) {
    purchases.put(team_id, article_id);
  }

}
