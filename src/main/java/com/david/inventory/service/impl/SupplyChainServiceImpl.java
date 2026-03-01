package com.david.inventory.service.impl;

import com.david.inventory.dto.request.CategoryRequest;
import com.david.inventory.dto.request.SupplierRequest;
import com.david.inventory.dto.response.CategoryResponse;
import com.david.inventory.dto.response.SupplierResponse;
import com.david.inventory.entity.Category;
import com.david.inventory.entity.Supplier;
import com.david.inventory.repository.CategoryRepository;
import com.david.inventory.repository.SupplierRepository;
import com.david.inventory.service.SupplyChainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplyChainServiceImpl implements SupplyChainService {

    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoryTree() {
        return categoryRepository.findByParentCategoryIsNull()
                .stream()
                .map(this::mapCategoryToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .map(this::mapSupplierToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Categoría padre no encontrada"));
            category.setParentCategory(parent);
        }

        return mapCategoryToResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public SupplierResponse createSupplier(SupplierRequest request) {
        Supplier supplier = Supplier.builder()
                .companyName(request.getCompanyName())
                .contactName(request.getContactName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .notes(request.getNotes())
                .build();

        return mapSupplierToResponse(supplierRepository.save(supplier));
    }

    private CategoryResponse mapCategoryToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .subCategories(category.getSubCategories().stream()
                        .map(this::mapCategoryToResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    private SupplierResponse mapSupplierToResponse(Supplier s) {
        return SupplierResponse.builder()
                .id(s.getId())
                .companyName(s.getCompanyName())
                .contactName(s.getContactName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .address(s.getAddress())
                .notes(s.getNotes())
                .build();
    }
}
