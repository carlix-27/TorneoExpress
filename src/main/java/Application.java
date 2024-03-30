import com.google.gson.Gson;
import repository.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;



public class Application {
    private static final Gson gson = new Gson();
    public static void main(String[] args) {
        final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("lab1");

        Spark.port(4321);

        storedBasicUser(entityManagerFactory);

        /* 1. Basic Request */
        Spark.get("/hello",
                (req, resp) -> "Hello, World"
        );

    }

    private static void storedBasicUser(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Users users = new Users(entityManager);

        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();

        tx.commit();
        entityManager.close();
    }
}
