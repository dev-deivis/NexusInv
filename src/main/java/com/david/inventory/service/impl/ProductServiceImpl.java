package com.david.inventory.service.impl;

import com.david.inventory.dto.request.ProductRequest;
import com.david.inventory.dto.response.ProductResponse;
import com.david.inventory.entity.Product;
import com.david.inventory.repository.ProductRepository;
import com.david.inventory.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return mapToResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        String generatedSku = getNextSku();

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .sku(generatedSku)
                .unitPrice(request.getUnitPrice())
                .currentStock(request.getCurrentStock())
                .minStock(request.getMinStock())
                .active(true)
                .build();

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public String getNextSku() {
        return productRepository.findAll().stream()
                .map(Product::getSku)
                .filter(sku -> sku != null && sku.startsWith("NEX-"))
                .map(sku -> {
                    try {
                        return Integer.parseInt(sku.replace("NEX-", ""));
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .max(Integer::compare)
                .map(max -> String.format("NEX-%03d", max + 1))
                .orElse("NEX-001");
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setUnitPrice(request.getUnitPrice());
        product.setMinStock(request.getMinStock());
        // El stock actual no se debería editar aquí, sino vía movimientos, 
        // pero para el CRUD inicial lo permitimos.
        product.setCurrentStock(request.getCurrentStock());

        return mapToResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        // Eliminación lógica
        product.setActive(false);
        productRepository.save(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .sku(product.getSku())
                .unitPrice(product.getUnitPrice())
                .currentStock(product.getCurrentStock())
                .minStock(product.getMinStock())
                .active(product.isActive())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "Sin Categoría")
                .supplierName(product.getSupplier() != null ? product.getSupplier().getCompanyName() : "Sin Proveedor")
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
