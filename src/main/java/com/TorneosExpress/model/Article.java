package com.TorneosExpress.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Article {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @JsonProperty("id")
  private Long id;

  @Column()
  @JsonProperty("article_name")
  private String name;

  @Column()
  @JsonProperty("article_description")
  private String description;

  @Column()
  @JsonProperty("article_price")
  private int price;

}
