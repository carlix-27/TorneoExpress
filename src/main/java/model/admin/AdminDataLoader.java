package model.admin;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**Proposito del código
 * Este código básicamente me permite cargar datos a mi HSQLDB para que esten precargados.
 * Es importante notar que en el caso del Admin, por ahora no nos encargamos de iniciar sesión
 * **/
public class AdminDataLoader {
    public static void main(String[] args) {
        String url = "jdbc:hsqldb:file:../db/mydb";
        String user = "sa";
        String password = "";

        try (Connection connection = DriverManager.getConnection(url, user, password)) {
            PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO ADMINLOGININFORMATION (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_ID) VALUES (?, ?, ?)"
            );

            // Datos de los administradores
            String[] emails = {"admin1@example.com", "admin2@example.com", "admin3@example.com"};
            String[] passwords = {"password1", "password2", "password3"};
            String[] ids = {"1", "2", "3"};

            // Insertar los datos de los admins en la base de datos
            for (int i = 0; i < emails.length; i++) {
                statement.setString(1, emails[i]);
                statement.setString(2, passwords[i]);
                statement.setString(3, ids[i]);
                statement.executeUpdate();
            }
            System.out.println("Datos de administradores precargados exitosamente");

        } catch (SQLException e) {
            System.err.println("Error al precargar los datos de administrador");
        }
    }
}
