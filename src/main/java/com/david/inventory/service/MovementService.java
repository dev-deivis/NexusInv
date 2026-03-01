package com.david.inventory.service;

import com.david.inventory.dto.request.MovementRequest;
import com.david.inventory.dto.response.MovementResponse;

import java.util.List;

public interface MovementService {
    MovementResponse registerMovement(MovementRequest request, String userEmail);
    List<MovementResponse> getMovementHistory();
}
