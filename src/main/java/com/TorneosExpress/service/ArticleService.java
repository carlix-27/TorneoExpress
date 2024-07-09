package com.TorneosExpress.service;

import com.TorneosExpress.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArticleService  {
  private final ArticleRepository articleRepository;

  @Autowired
  public ArticleService(ArticleRepository articleRepository) {
    this.articleRepository = articleRepository;
  }
}
