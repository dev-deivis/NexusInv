package com.david.inventory.repository;

import com.david.inventory.entity.StockAlert;
import com.david.inventory.entity.enums.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertRepository extends JpaRepository<StockAlert, Long> {
    List<StockAlert> findByStatusOrderByCreatedAtDesc(AlertStatus status);
    Optional<StockAlert> findByProductIdAndStatus(Long productId, AlertStatus status);
    long countByStatus(AlertStatus status);
}
