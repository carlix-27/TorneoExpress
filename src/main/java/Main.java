import model.Guest.LoginResult;
import model.Guest.Guest;
import model.Sport;
import model.admin.Administrator;
import model.player.Player;
import model.player.PlayerLoginInformation;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class Main {
    public static void main(String[] args) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory("lab1");

        final EntityManager entityManager = factory.createEntityManager();

        //sample1(entityManager);
        // sample2(entityManager);
        // Sport Example
        // AddSport(entityManager); // Agregar  A
        // deleteSport(entityManager, 1); // Baja B
        updateSport(entityManager, 2, "Paddel", 2); // Modificar M

        entityManager.close();
        factory.close();
    }


    // -----
    // -----
    private static void sample1(EntityManager entityManager){
        final EntityTransaction transaction = entityManager.getTransaction();

        try {
            transaction.begin();


            // Crear y persistir instancias de Guest
            Guest player1 = new Guest();
            player1.register("nuevo guest", "buenos aires", "nuevoguest@example.com", "password1");
            entityManager.persist(player1);

            Guest player2 = new Guest();
            player2.register("guest 2", "rosario", "guest2@example.com", "password2");
            entityManager.persist(player2);

            Guest marcos = new Guest();
            marcos.register("alejandro", "entre rios", "ale@gmail.com", "password2");
            entityManager.persist(marcos);

            transaction.commit();
        } catch (Exception e){
            if(transaction.isActive()){
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    // -----
    // -----
    private static void sample2(EntityManager entityManager) {
        final EntityTransaction transaction = entityManager.getTransaction();

        try {
            transaction.begin();

            // Creating and persisting PlayerLoginInformation instances
            Guest player1 = new Guest();
            //player1.register("player1@example.com", "password1");
            entityManager.persist(player1);

            Guest player2 = new Guest();
            //player2.register("player2@example.com", "password2");
            entityManager.persist(player2);

            // Committing the transaction
            transaction.commit();

            // Attempt login after registration
            loginTest(player1, "player1@example.com", "password1");
            loginTest(player2, "player2@example.com", "password2");

        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    private static void loginTest(Guest player, String email, String password) {
        System.out.println("Attempting login for " + email + "...");
        LoginResult loginResult = player.login(email, password);

        // Check login result
        if (loginResult.isSuccess()) {
            System.out.println("Login successful!");
        } else {
            System.out.println("Invalid email or password. Login failed.");
        }
    }


    // -----
    // -----
    private static void AddSport(EntityManager entityManager){
        final EntityTransaction transaction = entityManager.getTransaction();

        try{
            transaction.begin();

            Administrator administrator = new Administrator(entityManager);
            // Add new sport
            administrator.createSport("Futbol", 11);
            administrator.createSport("Baloncesto", 5);

            // Cosas a evaluar:
            /* - no deben repetirse los deportes, si los distintos modos
            * por ejemplo futbol 5, futbol 11, burbufutbol o variantes, pero no los mismos deportes*/
            transaction.commit();
            System.out.println("Deporte creado exitosamente");

        } catch (Exception e){
            if(transaction.isActive()){
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    private static void deleteSport(EntityManager entityManager, long sport_id){
        final EntityTransaction transaction = entityManager.getTransaction();

        try {
            transaction.begin();

            Administrator administrator = new Administrator(entityManager);
            administrator.deleteSport(sport_id);
            transaction.commit();
            System.out.println("Deporte eliminado exitosamente");
        } catch (Exception e) {
            if (transaction != null && transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    private static void updateSport(EntityManager entityManager, long sport_id, String newSportName, int newNumPlayers){
        final EntityTransaction transaction = entityManager.getTransaction();

        try{
            transaction.begin();

            Administrator administrator = new Administrator(entityManager);
            administrator.updateSport(sport_id, newSportName, newNumPlayers);
            transaction.commit();
            System.out.println("Deporte actualizado exitosamente");

        } catch (Exception e){
            if (transaction != null && transaction.isActive()) {
                transaction.rollback();
            }
            e.printStackTrace();
        }

    }
}
