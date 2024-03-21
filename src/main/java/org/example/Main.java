package org.example;

import org.example.model.Captain;
import org.example.model.User;
import org.example.model.player.Player;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class Main {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("lab1");

        final EntityManager entityManager = factory.createEntityManager();

        try{
            sample1(entityManager);
        } catch (Exception e){
            e.printStackTrace();
        } finally {
            entityManager.close();
            factory.close();
        }
    }

    private static void sample1(EntityManager entityManager){
        final EntityTransaction transaction = entityManager.getTransaction();

        try {
            transaction.begin();


            final User pablo = new Player("pablo", "player1@gmail.com", "1234");

            final User roberto = new Captain("roberto", "player2@gmail.com", "1234");

            entityManager.persist(pablo);
            entityManager.persist(roberto);

            transaction.commit();
        } catch (Exception e){
            if(transaction.isActive()){
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }


}