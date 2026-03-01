package com.david.inventory.service;

import com.david.inventory.dto.response.AlertResponse;
import com.david.inventory.entity.Product;

import java.util.List;

public interface AlertService {
    List<AlertResponse> getActiveAlerts();
    void processProductStock(Product product);
    long getActiveAlertsCount();
}
