import com.google.common.base.Strings;
import com.google.gson.Gson;
import model.User;
import model.player.PlayerLoginInformation;
import repository.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.List;
import java.util.stream.Collectors;


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

        Spark.get("/persisted-users/:id",
                (req, resp) -> {
                    final String id = req.params("id");

                    /* Business Logic */
                    final EntityManager entityManager = entityManagerFactory.createEntityManager();
                    final EntityTransaction tx = entityManager.getTransaction();
                    tx.begin();
                    User user = entityManager.find(User.class, Long.valueOf(id));
                    tx.commit();
                    entityManager.close();

                    resp.type("application/json");
                    return user.asJson();
                }
        );

        Spark.get("/users/:name",
                (req, resp) -> {
                    final String name = capitalized(req.params("name"));

                    final User user = User.create(name + "@gmail.com").build();

                    resp.type("application/json");

                    return user.asJson();
                }
        );

        /* 7. Get all registered emails */
        Spark.get("/emails", (req, resp) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);

            List<String> emails = users.listAll().stream()
                    .map(PlayerLoginInformation::getPlayer_email)
                    .collect(Collectors.toList());

            resp.type("application/json");
            return gson.toJson(emails);
        });

    }

    private static void storedBasicUser(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();

        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();

        tx.commit();
        entityManager.close();
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }
}
