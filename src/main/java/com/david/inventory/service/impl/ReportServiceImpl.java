package com.david.inventory.service.impl;

import com.david.inventory.dto.response.AlertResponse;
import com.david.inventory.dto.response.MovementResponse;
import com.david.inventory.dto.response.ProductResponse;
import com.david.inventory.entity.Product;
import com.david.inventory.entity.enums.AlertStatus;
import com.david.inventory.entity.enums.MovementType;
import com.david.inventory.repository.AlertRepository;
import com.david.inventory.repository.MovementRepository;
import com.david.inventory.repository.ProductRepository;
import com.david.inventory.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ProductRepository productRepository;
    private final MovementRepository movementRepository;
    private final AlertRepository alertRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        List<Product> products = productRepository.findByActiveTrue();
        
        BigDecimal totalValue = products.stream()
                .map(p -> p.getUnitPrice().multiply(BigDecimal.valueOf(p.getCurrentStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long activeAlerts = alertRepository.countByStatus(AlertStatus.ACTIVE);
        long totalProducts = products.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalValue", totalValue);
        stats.put("activeAlerts", activeAlerts);
        stats.put("totalProducts", totalProducts);
        stats.put("turnoverRate", 4.2);
        
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getWeeklyStats() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<com.david.inventory.entity.InventoryMovement> movements = movementRepository.findByCreatedAtAfter(sevenDaysAgo);

        List<Map<String, Object>> stats = new ArrayList<>();
        
        for (int i = 6; i >= 0; i--) {
            LocalDateTime day = LocalDateTime.now().minusDays(i);
            String dayName = day.getDayOfWeek().getDisplayName(TextStyle.SHORT, new Locale("es", "ES"));
            
            long entries = movements.stream()
                    .filter(m -> m.getCreatedAt().toLocalDate().isEqual(day.toLocalDate()))
                    .filter(m -> m.getType() == MovementType.ENTRY)
                    .count();
            
            long exits = movements.stream()
                    .filter(m -> m.getCreatedAt().toLocalDate().isEqual(day.toLocalDate()))
                    .filter(m -> m.getType() == MovementType.EXIT)
                    .count();

            Map<String, Object> dayMap = new HashMap<>();
            dayName = dayName.substring(0, 1).toUpperCase() + dayName.substring(1);
            dayMap.put("name", dayName);
            dayMap.put("entrada", entries);
            dayMap.put("salida", exits);
            stats.add(dayMap);
        }
        
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovementResponse> getMovementReport() {
        return movementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(m -> MovementResponse.builder()
                        .id(m.getId())
                        .productName(m.getProduct().getName())
                        .productSku(m.getProduct().getSku())
                        .type(m.getType().name())
                        .quantity(m.getQuantity())
                        .userName(m.getUser().getName())
                        .createdAt(m.getCreatedAt())
                        .reason(m.getReason())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getStockValuationReport() {
        return productRepository.findByActiveTrue().stream()
                .map(p -> ProductResponse.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .sku(p.getSku())
                        .unitPrice(p.getUnitPrice())
                        .currentStock(p.getCurrentStock())
                        .categoryName(p.getCategory() != null ? p.getCategory().getName() : "N/A")
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlertResponse> getLowStockReport() {
        return alertRepository.findByStatusOrderByCreatedAtDesc(AlertStatus.ACTIVE).stream()
                .map(a -> AlertResponse.builder()
                        .id(a.getId())
                        .productName(a.getProduct().getName())
                        .productSku(a.getProduct().getSku())
                        .currentStock(a.getProduct().getCurrentStock())
                        .minStock(a.getProduct().getMinStock())
                        .createdAt(a.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
