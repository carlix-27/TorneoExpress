
package com.TorneosExpress.repository;

import com.TorneosExpress.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long>{
}
