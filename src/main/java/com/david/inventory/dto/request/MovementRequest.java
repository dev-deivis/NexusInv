package com.david.inventory.dto.request;

import com.david.inventory.entity.enums.MovementType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MovementRequest {
    @NotNull(message = "El producto es obligatorio")
    private Long productId;

    @NotNull(message = "El tipo de movimiento es obligatorio")
    private MovementType type;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer quantity;

    private String reason;
    private String notes;
}
