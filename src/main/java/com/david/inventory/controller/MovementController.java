package com.david.inventory.controller;

import com.david.inventory.dto.request.MovementRequest;
import com.david.inventory.dto.response.MovementResponse;
import com.david.inventory.service.MovementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movements")
@RequiredArgsConstructor
public class MovementController {

    private final MovementService movementService;

    @PostMapping
    public ResponseEntity<MovementResponse> registerMovement(
            @Valid @RequestBody MovementRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(movementService.registerMovement(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<MovementResponse>> getHistory() {
        return ResponseEntity.ok(movementService.getMovementHistory());
    }
}
