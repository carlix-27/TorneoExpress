package com.TorneosExpress.model.shop;

import jakarta.persistence.*;

@Entity
public class Article {

  @Id
  private Long article_id;

  @Column()
  private String article_name;

  @Column()
  private String description;

  @Column()
  private float price;

}
