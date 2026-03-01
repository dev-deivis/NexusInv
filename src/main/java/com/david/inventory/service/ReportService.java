package com.david.inventory.service;

import com.david.inventory.dto.response.AlertResponse;
import com.david.inventory.dto.response.MovementResponse;
import com.david.inventory.dto.response.ProductResponse;

import java.util.List;
import java.util.Map;

public interface ReportService {
    Map<String, Object> getDashboardStats();
    List<Map<String, Object>> getWeeklyStats();
    List<MovementResponse> getMovementReport();
    List<ProductResponse> getStockValuationReport();
    List<AlertResponse> getLowStockReport();
}
