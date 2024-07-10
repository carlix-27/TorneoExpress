package com.TorneosExpress.service;

import com.TorneosExpress.model.Article;
import com.TorneosExpress.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleService  {
  private final ArticleRepository articleRepository;

  @Autowired
  public ArticleService(ArticleRepository articleRepository) {
    this.articleRepository = articleRepository;
  }

  public List<Article> getAllArticles() {
    return articleRepository.findAll();
  }

  public Article findById(long id) {
    return articleRepository.findById(id);
  }
}
