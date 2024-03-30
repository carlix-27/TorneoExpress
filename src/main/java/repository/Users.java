package repository;


import model.User;
import model.player.PlayerLoginInformation;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Users {

    private final EntityManager entityManager;

    public Users(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(entityManager.find(User.class, id));
    }

    public Optional<User> findByEmail(String email) {
        return entityManager
                .createQuery("SELECT u FROM User u WHERE u.email LIKE :email", User.class)
                .setParameter("email", email).getResultList()
                .stream()
                .findFirst();
    }

    public List<PlayerLoginInformation> listAll() {
        return entityManager.createQuery("SELECT u FROM PlayerLoginInformation u", PlayerLoginInformation.class).getResultList();
    }

    public User persist(User user) {
        entityManager.persist(user);
        return user;
    }
}