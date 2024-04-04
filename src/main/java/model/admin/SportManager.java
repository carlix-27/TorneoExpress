package model.admin;

import model.Sport;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.NoSuchElementException;

public class SportManager {

  @PersistenceContext
  private EntityManager entityManager;

  public SportManager(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  public void createSport(String sportName, int numPlayers){
    Sport sport = new Sport();
    sport.setSport(sportName);
    sport.setNumPlayers(numPlayers);
    entityManager.persist(sport);
  }

  /*Evaluá acá el caso donde fue eliminado, pero sigue habiendo elementos
   * Solo el id no existe pero sigue haciendo elementos!*/
  public void deleteSport(long sportId){
    Sport sport = entityManager.find(Sport.class, sportId);
    if(sport != null){
      entityManager.remove(sport);
    }
    else {
      throw new NoSuchElementException("Deporte ya eliminado o no hay deporte alguno");
    }
  }

  public void updateSport(long sportId, String newSportName, int newNumPlayers){
    Sport sport = entityManager.find(Sport.class, sportId);
    if(sport != null){
      sport.setSport(newSportName);
      sport.setNumPlayers(newNumPlayers);
      entityManager.merge(sport);
    }
  }
}
