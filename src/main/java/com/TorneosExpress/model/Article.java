package com.TorneosExpress.model;

import jakarta.persistence.*;

@Entity
public class Article {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column()
  private String name;

  @Column()
  private String description;

  @Column()
  private float price;

}
