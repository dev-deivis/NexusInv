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
        // Lógica de Stock Bajo
        if (product.getCurrentStock() <= product.getMinStock()) {
            createAlertIfNeeded(product, AlertType.LOW_STOCK);
        } 
        // Lógica de Exceso de Stock
        else if (product.getCurrentStock() >= product.getMaxStock()) {
            createAlertIfNeeded(product, AlertType.EXCESS_STOCK);
        } 
        // Lógica de Resolución (Stock Normal)
        else {
            resolveActiveAlerts(product);
        }
    }

    private void createAlertIfNeeded(Product product, AlertType type) {
        // Solo creamos si no hay una alerta ACTIVA del MISMO tipo
        boolean exists = alertRepository.findByProductIdAndStatus(product.getId(), AlertStatus.ACTIVE)
                .stream()
                .anyMatch(a -> a.getAlertType() == type);

        if (!exists) {
            // Antes de crear una nueva, resolvemos las que sean de otro tipo (ej. si pasamos de stock bajo a stock normal)
            resolveActiveAlerts(product);

            StockAlert alert = StockAlert.builder()
                    .product(product)
                    .alertType(type)
                    .status(AlertStatus.ACTIVE)
                    .build();
            alertRepository.saveAndFlush(alert);
        }
    }

    private void resolveActiveAlerts(Product product) {
        alertRepository.findByProductIdAndStatus(product.getId(), AlertStatus.ACTIVE)
                .stream()
                .forEach(alert -> {
                    alert.setStatus(AlertStatus.RESOLVED);
                    alert.setResolvedAt(LocalDateTime.now());
                    alertRepository.saveAndFlush(alert);
                });
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
                .maxStock(alert.getProduct().getMaxStock()) // <--- CORRECCIÓN: Incluido maxStock
                .alertType(alert.getAlertType().name())
                .status(alert.getStatus().name())
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .build();
    }
}
