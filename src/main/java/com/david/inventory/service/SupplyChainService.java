package com.david.inventory.service;

import com.david.inventory.dto.request.CategoryRequest;
import com.david.inventory.dto.request.SupplierRequest;
import com.david.inventory.dto.response.CategoryResponse;
import com.david.inventory.dto.response.SupplierResponse;

import java.util.List;

public interface SupplyChainService {
    List<CategoryResponse> getCategoryTree();
    List<SupplierResponse> getAllSuppliers();
    CategoryResponse createCategory(CategoryRequest request);
    SupplierResponse createSupplier(SupplierRequest request);
}
