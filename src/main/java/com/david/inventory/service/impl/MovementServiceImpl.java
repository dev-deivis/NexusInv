package com.david.inventory.service.impl;

import com.david.inventory.dto.request.MovementRequest;
import com.david.inventory.dto.response.MovementResponse;
import com.david.inventory.entity.InventoryMovement;
import com.david.inventory.entity.Product;
import com.david.inventory.entity.User;
import com.david.inventory.entity.enums.MovementType;
import com.david.inventory.repository.MovementRepository;
import com.david.inventory.repository.ProductRepository;
import com.david.inventory.repository.UserRepository;
import com.david.inventory.service.AlertService;
import com.david.inventory.service.MovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovementServiceImpl implements MovementService {

    private final MovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AlertService alertService;

    @Override
    @Transactional
    public MovementResponse registerMovement(MovementRequest request, String userEmail) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar stock del producto
        if (request.getType() == MovementType.ENTRY) {
            product.setCurrentStock(product.getCurrentStock() + request.getQuantity());
        } else if (request.getType() == MovementType.EXIT) {
            if (product.getCurrentStock() < request.getQuantity()) {
                throw new RuntimeException("Stock insuficiente para realizar la salida");
            }
            product.setCurrentStock(product.getCurrentStock() - request.getQuantity());
        } else if (request.getType() == MovementType.ADJUSTMENT) {
            product.setCurrentStock(request.getQuantity());
        }

        productRepository.save(product);
        
        // Procesar alertas después de actualizar el stock
        alertService.processProductStock(product);

        InventoryMovement movement = InventoryMovement.builder()
                .product(product)
                .type(request.getType())
                .quantity(request.getQuantity())
                .reason(request.getReason())
                .notes(request.getNotes())
                .user(user)
                .build();

        return mapToResponse(movementRepository.save(movement));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovementResponse> getMovementHistory() {
        return movementRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MovementResponse mapToResponse(InventoryMovement m) {
        return MovementResponse.builder()
                .id(m.getId())
                .productName(m.getProduct().getName())
                .productSku(m.getProduct().getSku())
                .type(m.getType().name())
                .quantity(m.getQuantity())
                .userName(m.getUser().getName())
                .createdAt(m.getCreatedAt())
                .reason(m.getReason())
                .build();
    }
}
