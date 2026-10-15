package com.omega.stationery.controller;

import com.omega.stationery.model.ApiResponse;
import com.omega.stationery.model.Product;
import com.omega.stationery.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean featured) {
        List<Product> products = productService.getAllProducts(category, search, featured);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/page")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<Product>>> getProductsPaginated(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {
        org.springframework.data.domain.Page<Product> paginated = productService.getProductsPaginated(
                category, search, featured, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(paginated));
    }

    @PostMapping("/cache/clear")
    public ResponseEntity<ApiResponse<String>> clearCache() {
        productService.clearQueryCache();
        return ResponseEntity.ok(ApiResponse.success("Catalog query cache cleared successfully."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        Product created = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully in MongoDB", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable String id,
            @RequestBody Product product) {
        Product updated = productService.updateProduct(id, product);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", id));
    }
}
