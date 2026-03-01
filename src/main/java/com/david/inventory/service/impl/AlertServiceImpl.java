package com.david.inventory.service.impl;

import com.david.inventory.dto.response.AlertResponse;
import com.david.inventory.entity.Product;
import com.david.inventory.entity.StockAlert;
import com.david.inventory.entity.enums.AlertStatus;
import com.david.inventory.entity.enums.AlertType;
import com.david.inventory.repository.AlertRepository;
import com.david.inventory.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AlertResponse> getActiveAlerts() {
        return alertRepository.findByStatusOrderByCreatedAtDesc(AlertStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void processProductStock(Product product) {
        if (product.getCurrentStock() <= product.getMinStock()) {
            // Crear alerta si no existe una activa
            if (alertRepository.findByProductIdAndStatus(product.getId(), AlertStatus.ACTIVE).isEmpty()) {
                StockAlert alert = StockAlert.builder()
                        .product(product)
                        .alertType(AlertType.LOW_STOCK)
                        .status(AlertStatus.ACTIVE)
                        .build();
                alertRepository.save(alert);
            }
        } else {
            // Resolver alerta si existe una activa
            alertRepository.findByProductIdAndStatus(product.getId(), AlertStatus.ACTIVE)
                    .ifPresent(alert -> {
                        alert.setStatus(AlertStatus.RESOLVED);
                        alert.setResolvedAt(LocalDateTime.now());
                        alertRepository.save(alert);
                    });
        }
    }

    @Override
    @Transactional(readOnly = true)
    public long getActiveAlertsCount() {
        return alertRepository.countByStatus(AlertStatus.ACTIVE);
    }

    private AlertResponse mapToResponse(StockAlert alert) {
        return AlertResponse.builder()
                .id(alert.getId())
                .productId(alert.getProduct().getId())
                .productName(alert.getProduct().getName())
                .productSku(alert.getProduct().getSku())
                .currentStock(alert.getProduct().getCurrentStock())
                .minStock(alert.getProduct().getMinStock())
                .alertType(alert.getAlertType().name())
                .status(alert.getStatus().name())
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .build();
    }
}
