package com.david.inventory.service.impl;

import com.david.inventory.dto.request.ProductRequest;
import com.david.inventory.dto.response.ProductResponse;
import com.david.inventory.entity.Product;
import com.david.inventory.entity.User;
import com.david.inventory.entity.enums.UserRole;
import com.david.inventory.repository.ProductRepository;
import com.david.inventory.repository.UserRepository;
import com.david.inventory.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    private void checkPermission(String action) {
        User user = getCurrentUser();
        if (user.getRole() == UserRole.ADMIN) return;

        if (action.equals("EDIT") && !user.isCanEditProducts()) {
            throw new RuntimeException("Protocolo denegado: No posee privilegios de escritura en la red.");
        }
        if (action.equals("DELETE") && !user.isCanDeleteProducts()) {
            throw new RuntimeException("Protocolo denegado: No posee privilegios de purga en la red.");
        }
    }

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
        checkPermission("EDIT");
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
        checkPermission("EDIT");
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setUnitPrice(request.getUnitPrice());
        product.setMinStock(request.getMinStock());
        product.setCurrentStock(request.getCurrentStock());

        return mapToResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        checkPermission("DELETE");
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
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
