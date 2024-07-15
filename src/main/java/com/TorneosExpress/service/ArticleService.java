package com.TorneosExpress.service;

import com.TorneosExpress.model.Article;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleService  {
  private final ArticleRepository articleRepository;
  private final TeamService teamService;

  @Autowired
  public ArticleService(ArticleRepository articleRepository, TeamService teamService) {
    this.articleRepository = articleRepository;
      this.teamService = teamService;
  }

  public List<Article> getAllArticles() {
    return articleRepository.findAll();
  }

  public Article findById(long id) {
    return articleRepository.findById(id);
  }

  public List<Article> getArticlesOfTeam(Long teamId) {
    Team team = teamService.findById(teamId);
    return team.getArticles();
  }

}
