package com.david.inventory.dto.request;

import com.david.inventory.entity.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    private String password; // Opcional en edición

    @NotNull(message = "El rol es obligatorio")
    private UserRole role;

    private String department;
    private boolean active;
    private boolean canEditProducts;
    private boolean canDeleteProducts;
}
