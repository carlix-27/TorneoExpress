package com.TorneosExpress.controller;

import com.TorneosExpress.model.Article;
import com.TorneosExpress.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
  private final ArticleService articleService;

  @Autowired
  public ArticleController(ArticleService articleService) {
    this.articleService = articleService;
  }

  @GetMapping("/{teamId}")
  public List<Article> getArticlesByTeamId(@PathVariable Long teamId) {
    return articleService.getArticlesOfTeam(teamId);
  }

  @GetMapping("/all")
  public List<Article> getAllArticles() {
    return articleService.getAllArticles();
  }

  @GetMapping("/article/{articleId}")
  public ResponseEntity<Article> getArticleById(@PathVariable Long articleId) {
    Article article = articleService.findById(articleId);
    return ResponseEntity.ok(article);
  }
}
