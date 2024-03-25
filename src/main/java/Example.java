import java.sql.*;

public class Example {

    static final String URL = "jdbc:hsqldb:hsql://localhost/";

    public static void main(String[] args) {

        try {

            Class.forName("org.hsqldb.jdbc.JDBCDriver");

            test();

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    private static void test() throws SQLException {

        Connection conn = DriverManager.getConnection(URL, "SA", "");

        Statement stmt = conn.createStatement();

        ResultSet rs = stmt.executeQuery("SELECT * FROM messages;");

        while (rs.next()) {

            System.out.println("ID: " + rs.getString("text"));

        }

    }

}

