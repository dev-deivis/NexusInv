package com.david.inventory.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupplierRequest {
    @NotBlank(message = "El nombre de la empresa es obligatorio")
    private String companyName;
    
    private String contactName;
    
    @Email(message = "Formato de email inválido")
    private String email;
    
    private String phone;
    private String address;
    private String notes;
}
