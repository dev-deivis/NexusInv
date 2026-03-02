package com.david.inventory.controller;

import com.david.inventory.dto.response.AlertResponse;
import com.david.inventory.dto.response.MovementResponse;
import com.david.inventory.dto.response.ProductResponse;
import com.david.inventory.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
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

    @GetMapping("/export/excel")
    public ResponseEntity<InputStreamResource> exportExcel() {
        ByteArrayInputStream in = reportService.exportProductsToExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=inventario_nexus.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<InputStreamResource> exportPdf() {
        ByteArrayInputStream in = reportService.exportProductsToPdf();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=inventario_nexus.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}
