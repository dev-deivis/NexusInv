package com.david.inventory.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AlertResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private Integer currentStock;
    private Integer minStock;
    private Integer maxStock;
    private String alertType;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
