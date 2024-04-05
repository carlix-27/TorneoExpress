
import model.User;
import model.player.PlayerLoginInformation;
import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import repository.Users;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

import java.util.List;
import java.util.stream.Collectors;


@RestController
public class Application {

    private final EntityManagerFactory entityManagerFactory;

    public Application(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @GetMapping("/hello")
    public String helloWorld() {
        return "Hello, World";
    }

    @GetMapping("/persisted-users/{id}")
    public User getUserById(@PathVariable Long id) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        User user = entityManager.find(User.class, id);
        entityManager.close();
        return user;
    }

    @GetMapping("/users/{name}")
    public User getUserByName(@PathVariable String name) {
        String formattedName = capitalize(name);
        return User.create(formattedName + "@gmail.com").build();
    }

    @GetMapping(value = "/emails", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<String> getAllEmails() {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Users usersRepository = new Users(entityManager);

        List<String> emails = usersRepository.listAll().stream()
                .map(PlayerLoginInformation::getPlayer_email)
                .collect(Collectors.toList());

        entityManager.close();
        return emails;
    }

    private String capitalize(String name) {
        if (name == null || name.isEmpty()) {
            return name;
        }
        return name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }
}
