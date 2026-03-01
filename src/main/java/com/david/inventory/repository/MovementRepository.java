package com.david.inventory.repository;

import com.david.inventory.entity.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findAllByOrderByCreatedAtDesc();
    List<InventoryMovement> findByCreatedAtAfter(LocalDateTime date);
}
