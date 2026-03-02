package com.david.inventory.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String sku;
    private BigDecimal unitPrice;
    private Integer currentStock;
    private Integer minStock;
    private Integer maxStock;
    private boolean active;
    private String categoryName;
    private String supplierName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
