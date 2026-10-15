package com.omega.stationery.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omega.stationery.exception.GlobalExceptionHandler;
import com.omega.stationery.exception.ResourceNotFoundException;
import com.omega.stationery.model.Product;
import com.omega.stationery.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductController Web Layer Tests")
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private Product testProduct;

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        mockMvc = MockMvcBuilders.standaloneSetup(productController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        testProduct = new Product("prod-q2", "OMEGA Hardcover Counter Book Q2", "Counter Books", 56000.0, "OMG-CB-Q2", "In Stock");
    }

    @Test
    @DisplayName("GET /api/products - Should return 200 OK with list of products")
    void testGetAllProducts() throws Exception {
        when(productService.getAllProducts(any(), any(), any())).thenReturn(List.of(testProduct));

        mockMvc.perform(get("/api/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].id", is("prod-q2")))
                .andExpect(jsonPath("$.data[0].name", is("OMEGA Hardcover Counter Book Q2")));
    }

    @Test
    @DisplayName("GET /api/products/{id} - Should return 200 OK when product exists")
    void testGetProductByIdSuccess() throws Exception {
        when(productService.getProductById("prod-q2")).thenReturn(testProduct);

        mockMvc.perform(get("/api/products/prod-q2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is("prod-q2")));
    }

    @Test
    @DisplayName("GET /api/products/{id} - Should return 404 NOT_FOUND via GlobalExceptionHandler when missing")
    void testGetProductByIdNotFound() throws Exception {
        when(productService.getProductById("prod-missing"))
                .thenThrow(new ResourceNotFoundException("Product not found with id: prod-missing"));

        mockMvc.perform(get("/api/products/prod-missing")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Product not found with id: prod-missing")));
    }

    @Test
    @DisplayName("POST /api/products - Should return 201 CREATED for new valid product")
    void testCreateProduct() throws Exception {
        when(productService.createProduct(any(Product.class))).thenReturn(testProduct);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProduct)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is("prod-q2")));
    }
}
