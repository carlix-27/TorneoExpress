package com.TorneosExpress.repository;

import com.TorneosExpress.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {
  Article findArticleById(long id);
}
