package com.david.inventory;

import com.david.inventory.entity.User;
import com.david.inventory.entity.enums.UserRole;
import com.david.inventory.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class InventoryManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventoryManagementApplication.class, args);
	}

	@Bean
	public CommandLineRunner setupDefaultUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			userRepository.findByEmail("admin@inventory.com").ifPresentOrElse(
					user -> {
						user.setPassword(passwordEncoder.encode("admin123"));
						userRepository.save(user);
						System.out.println(">>> Contraseña de Admin actualizada a 'admin123'");
					},
					() -> {
						User admin = User.builder()
								.name("System Admin")
								.email("admin@inventory.com")
								.password(passwordEncoder.encode("admin123"))
								.role(UserRole.ADMIN)
								.active(true)
								.build();
						userRepository.save(admin);
						System.out.println(">>> Usuario Admin creado con éxito");
					}
			);
		};
	}
}
