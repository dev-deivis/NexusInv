package com.david.inventory.controller;

import com.david.inventory.dto.request.CategoryRequest;
import com.david.inventory.dto.request.SupplierRequest;
import com.david.inventory.dto.response.CategoryResponse;
import com.david.inventory.dto.response.SupplierResponse;
import com.david.inventory.service.SupplyChainService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supply-chain")
@RequiredArgsConstructor
public class SupplyChainController {

    private final SupplyChainService supplyChainService;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        return ResponseEntity.ok(supplyChainService.getCategoryTree());
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        return new ResponseEntity<>(supplyChainService.createCategory(request), HttpStatus.CREATED);
    }

    @GetMapping("/suppliers")
    public ResponseEntity<List<SupplierResponse>> getSuppliers() {
        return ResponseEntity.ok(supplyChainService.getAllSuppliers());
    }

    @PostMapping("/suppliers")
    public ResponseEntity<SupplierResponse> createSupplier(@Valid @RequestBody SupplierRequest request) {
        return new ResponseEntity<>(supplyChainService.createSupplier(request), HttpStatus.CREATED);
    }
}
