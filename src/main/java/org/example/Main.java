package org.example;

import org.example.model.Guest.LoginResult;
import org.example.model.player.PlayerLoginInformation;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class Main {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("lab1");

        final EntityManager entityManager = factory.createEntityManager();


        sample2(entityManager);

        entityManager.close();
        factory.close();
    }

    private static void sample1(EntityManager entityManager){
        final EntityTransaction transaction = entityManager.getTransaction();

        try {
            transaction.begin();

            // Creating and persisting PlayerLoginInformation instances
            PlayerLoginInformation player1 = new PlayerLoginInformation();
            player1.register("player1@example.com", "password1");
            entityManager.persist(player1);

            PlayerLoginInformation player2 = new PlayerLoginInformation();
            player2.register("player2@example.com", "password2");
            entityManager.persist(player2);

            transaction.commit();
        } catch (Exception e){
            if(transaction.isActive()){
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    private static void sample2(EntityManager entityManager) {
        final EntityTransaction transaction = entityManager.getTransaction();

        try {
            transaction.begin();

            // Creating and persisting PlayerLoginInformation instances
            PlayerLoginInformation player1 = new PlayerLoginInformation();
            player1.register("player1@example.com", "password1");
            entityManager.persist(player1);

            PlayerLoginInformation player2 = new PlayerLoginInformation();
            player2.register("player2@example.com", "password2");
            entityManager.persist(player2);

            // Committing the transaction
            transaction.commit();

            // Attempt login after registration
            loginTest(player1, "player3@example.com", "password1");
            loginTest(player2, "player2@example.com", "password2");

        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    private static void loginTest(PlayerLoginInformation player, String email, String password) {
        System.out.println("Attempting login for " + email + "...");
        LoginResult loginResult = player.login(email, password);

        // Check login result
        if (loginResult.isSuccess()) {
            System.out.println("Login successful!");
        } else {
            System.out.println("Invalid email or password. Login failed.");
        }
    }

}
