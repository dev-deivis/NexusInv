package com.david.inventory.service.impl;

import com.david.inventory.dto.response.AlertResponse;
import com.david.inventory.dto.response.MovementResponse;
import com.david.inventory.dto.response.ProductResponse;
import com.david.inventory.entity.Product;
import com.david.inventory.entity.enums.AlertStatus;
import com.david.inventory.entity.enums.MovementType;
import com.david.inventory.repository.AlertRepository;
import com.david.inventory.repository.MovementRepository;
import com.david.inventory.repository.ProductRepository;
import com.david.inventory.service.ReportService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ProductRepository productRepository;
    private final MovementRepository movementRepository;
    private final AlertRepository alertRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        List<Product> products = productRepository.findByActiveTrue();
        BigDecimal totalValue = products.stream()
                .map(p -> p.getUnitPrice().multiply(BigDecimal.valueOf(p.getCurrentStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long activeAlerts = alertRepository.countByStatus(AlertStatus.ACTIVE);
        long totalProducts = products.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalValue", totalValue);
        stats.put("activeAlerts", activeAlerts);
        stats.put("totalProducts", totalProducts);
        stats.put("turnoverRate", 4.2);
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getWeeklyStats() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<com.david.inventory.entity.InventoryMovement> movements = movementRepository.findByCreatedAtAfter(sevenDaysAgo);
        List<Map<String, Object>> stats = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime day = LocalDateTime.now().minusDays(i);
            String dayName = day.getDayOfWeek().getDisplayName(TextStyle.SHORT, new Locale("es", "ES"));
            long entries = movements.stream()
                    .filter(m -> m.getCreatedAt().toLocalDate().isEqual(day.toLocalDate()))
                    .filter(m -> m.getType() == MovementType.ENTRY).count();
            long exits = movements.stream()
                    .filter(m -> m.getCreatedAt().toLocalDate().isEqual(day.toLocalDate()))
                    .filter(m -> m.getType() == MovementType.EXIT).count();
            Map<String, Object> dayMap = new HashMap<>();
            dayName = dayName.substring(0, 1).toUpperCase() + dayName.substring(1);
            dayMap.put("name", dayName);
            dayMap.put("entrada", entries);
            dayMap.put("salida", exits);
            stats.add(dayMap);
        }
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovementResponse> getMovementReport() {
        return movementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(m -> MovementResponse.builder()
                        .id(m.getId())
                        .productName(m.getProduct().getName())
                        .productSku(m.getProduct().getSku())
                        .type(m.getType().name())
                        .quantity(m.getQuantity())
                        .userName(m.getUser().getName())
                        .createdAt(m.getCreatedAt())
                        .reason(m.getReason())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getStockValuationReport() {
        return productRepository.findByActiveTrue().stream()
                .map(p -> ProductResponse.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .sku(p.getSku())
                        .unitPrice(p.getUnitPrice())
                        .currentStock(p.getCurrentStock())
                        .categoryName(p.getCategory() != null ? p.getCategory().getName() : "N/A")
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlertResponse> getLowStockReport() {
        return alertRepository.findByStatusOrderByCreatedAtDesc(AlertStatus.ACTIVE).stream()
                .map(a -> AlertResponse.builder()
                        .id(a.getId())
                        .productName(a.getProduct().getName())
                        .productSku(a.getProduct().getSku())
                        .currentStock(a.getProduct().getCurrentStock())
                        .minStock(a.getProduct().getMinStock())
                        .createdAt(a.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public ByteArrayInputStream exportProductsToExcel() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Inventario NEXUS");

            // Cabeceras
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "SKU", "Nombre", "Categoría", "Stock Actual", "Precio Unitario", "Valor Total"};
            
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.BLUE_GREY.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font font = workbook.createFont();
            font.setColor(IndexedColors.WHITE.getIndex());
            font.setBold(true);
            headerStyle.setFont(font);

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Datos
            List<Product> products = productRepository.findByActiveTrue();
            int rowIdx = 1;
            for (Product product : products) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(product.getId());
                row.createCell(1).setCellValue(product.getSku());
                row.createCell(2).setCellValue(product.getName());
                row.createCell(3).setCellValue(product.getCategory() != null ? product.getCategory().getName() : "N/A");
                row.createCell(4).setCellValue(product.getCurrentStock());
                row.createCell(5).setCellValue(product.getUnitPrice().doubleValue());
                row.createCell(6).setCellValue(product.getUnitPrice().multiply(BigDecimal.valueOf(product.getCurrentStock())).doubleValue());
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error al generar Excel: " + e.getMessage());
        }
    }

    @Override
    public ByteArrayInputStream exportProductsToPdf() {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Título
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontTitle.setSize(18);
            Paragraph title = new Paragraph("Reporte de Inventario - NEXUS", fontTitle);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("Fecha: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))));
            document.add(new Paragraph(" "));

            // Tabla
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1, 3, 4, 3, 2, 3});

            String[] headers = {"ID", "SKU", "Nombre", "Categoría", "Stock", "Precio"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            List<Product> products = productRepository.findByActiveTrue();
            for (Product product : products) {
                table.addCell(product.getId().toString());
                table.addCell(product.getSku());
                table.addCell(product.getName());
                table.addCell(product.getCategory() != null ? product.getCategory().getName() : "N/A");
                table.addCell(product.getCurrentStock().toString());
                table.addCell("$" + product.getUnitPrice().toString());
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF: " + e.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
