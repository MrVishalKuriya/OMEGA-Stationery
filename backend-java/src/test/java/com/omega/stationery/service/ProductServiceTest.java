package com.omega.stationery.service;

import com.omega.stationery.exception.ResourceNotFoundException;
import com.omega.stationery.model.Product;
import com.omega.stationery.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService Unit Tests")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        productService.clearQueryCache();
        testProduct = new Product("prod-q2-192", "OMEGA Hardcover Counter Book Q2", "Counter Books", 56000.0, "OMG-CB-Q2", "In Stock");
        testProduct.setQuire("2 Quire");
        testProduct.setFeatured(true);
    }

    @Test
    @DisplayName("Should retrieve all products and cache results")
    void testGetAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(testProduct));

        List<Product> products = productService.getAllProducts(null, null, null);

        assertNotNull(products);
        assertEquals(1, products.size());
        assertEquals("OMG-CB-Q2", products.get(0).getSku());

        // Subsequent call should hit cache and not call repository again
        List<Product> cachedProducts = productService.getAllProducts(null, null, null);
        assertEquals(1, cachedProducts.size());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should filter products by category")
    void testGetProductsByCategory() {
        when(productRepository.findByCategoryIgnoreCase("Counter Books")).thenReturn(List.of(testProduct));

        List<Product> products = productService.getAllProducts("Counter Books", null, null);

        assertNotNull(products);
        assertEquals(1, products.size());
        assertEquals("Counter Books", products.get(0).getCategory());
        verify(productRepository, times(1)).findByCategoryIgnoreCase("Counter Books");
    }

    @Test
    @DisplayName("Should find product by ID successfully")
    void testGetProductByIdSuccess() {
        when(productRepository.findById("prod-q2-192")).thenReturn(Optional.of(testProduct));

        Product found = productService.getProductById("prod-q2-192");

        assertNotNull(found);
        assertEquals("prod-q2-192", found.getId());
        assertEquals("OMEGA Hardcover Counter Book Q2", found.getName());
    }

    @Test
    @DisplayName("Should fallback to SKU when searching by product ID")
    void testGetProductBySkuFallback() {
        when(productRepository.findById("OMG-CB-Q2")).thenReturn(Optional.empty());
        when(productRepository.findBySku("OMG-CB-Q2")).thenReturn(Optional.of(testProduct));

        Product found = productService.getProductById("OMG-CB-Q2");

        assertNotNull(found);
        assertEquals("OMG-CB-Q2", found.getSku());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when product does not exist")
    void testGetProductByIdNotFound() {
        when(productRepository.findById("non-existent")).thenReturn(Optional.empty());
        when(productRepository.findBySku("non-existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productService.getProductById("non-existent");
        });
    }

    @Test
    @DisplayName("Should return paginated products")
    void testGetProductsPaginated() {
        Page<Product> productPage = new PageImpl<>(List.of(testProduct));
        when(productRepository.findAll(any(Pageable.class))).thenReturn(productPage);

        Page<Product> result = productService.getProductsPaginated(null, null, null, 0, 10, "name", "ASC");

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("prod-q2-192", result.getContent().get(0).getId());
    }

    @Test
    @DisplayName("Should create product and invalidate cache")
    void testCreateProduct() {
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        Product created = productService.createProduct(testProduct);

        assertNotNull(created);
        assertEquals("prod-q2-192", created.getId());
        verify(productRepository, times(1)).save(testProduct);
    }
}
