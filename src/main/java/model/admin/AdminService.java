package model.admin;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

/**Propósito del código
 * La idea es que de acá se puedan modificar y agregar datos.
 * En la parte de TestAdmin, voy a poner a prueba estas dos clases para ver si todo funciona correctamente.
 * Importante. Evaluar como realizar el test de esto.*/
public class AdminService {
    @PersistenceContext
    private EntityManager entityManager;

    // Método que permite obtener todos los administradoress precargados
    public List<Administrator> getAllAdministrators(){
        return entityManager.createQuery("SELECT a FROM AdminLoginInformation a", Administrator.class).getResultList();
    }


    // Método para obtener un administrador por su ID
    public Administrator getAdminById(Long adminId) {
        return entityManager.find(Administrator.class, adminId);
    }

    // Método para actualizar los datos de un administrador
    @Transactional
    public void updateAdmin(Administrator admin) {
        entityManager.merge(admin);
    }

    // Método para eliminar un administrador por su ID
    @Transactional
    public void deleteAdmin(Long adminId) {
        Administrator admin = entityManager.find(Administrator.class, adminId);
        if (admin != null) {
            entityManager.remove(admin);
        }
    }

    public void setEntityManager(EntityManager entityManager) {

    }
}
