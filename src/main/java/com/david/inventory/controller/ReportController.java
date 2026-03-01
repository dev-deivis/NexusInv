package com.david.inventory.controller;

import com.david.inventory.dto.response.AlertResponse;
import com.david.inventory.dto.response.MovementResponse;
import com.david.inventory.dto.response.ProductResponse;
import com.david.inventory.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(reportService.getDashboardStats());
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<Map<String, Object>>> getWeekly() {
        return ResponseEntity.ok(reportService.getWeeklyStats());
    }

    @GetMapping("/movements")
    public ResponseEntity<List<MovementResponse>> getMovements() {
        return ResponseEntity.ok(reportService.getMovementReport());
    }

    @GetMapping("/valuation")
    public ResponseEntity<List<ProductResponse>> getValuation() {
        return ResponseEntity.ok(reportService.getStockValuationReport());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<AlertResponse>> getLowStock() {
        return ResponseEntity.ok(reportService.getLowStockReport());
    }
}
