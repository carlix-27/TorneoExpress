package model.admin;

import model.Sport;

import javax.persistence.*;
import java.util.NoSuchElementException;

public class Administrator {

    @PersistenceContext
    private EntityManager entityManager;

    public Administrator(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    @Id
    private long admin_id;

    @Column
    private String admin_mail;

    @Column
    private String admin_name;

    public void createTournament() {

    }

    public void updateRanking() {

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
