package com.david.inventory.service;

import com.david.inventory.dto.request.ProductRequest;
import com.david.inventory.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllActiveProducts();
    ProductResponse getProductById(Long id);
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    String getNextSku();
}
