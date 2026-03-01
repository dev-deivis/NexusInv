package com.david.inventory.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MovementResponse {
    private Long id;
    private String productName;
    private String productSku;
    private String type;
    private Integer quantity;
    private String userName;
    private LocalDateTime createdAt;
    private String reason;
}
