package com.omega.stationery.exception;

import com.mongodb.MongoTimeoutException;
import com.omega.stationery.model.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("GlobalExceptionHandler Unit Tests")
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("Should return 404 NOT_FOUND for ResourceNotFoundException")
    void testHandleResourceNotFound() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Product with ID 'xyz' not found");
        ResponseEntity<ApiResponse<String>> response = exceptionHandler.handleNotFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("Product with ID 'xyz' not found"));
    }

    @Test
    @DisplayName("Should return 400 BAD_REQUEST for IllegalArgumentException")
    void testHandleIllegalArgument() {
        IllegalArgumentException ex = new IllegalArgumentException("Quantity must be greater than zero");
        ResponseEntity<ApiResponse<String>> response = exceptionHandler.handleIllegalArgument(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Quantity must be greater than zero", response.getBody().getMessage());
    }

    @Test
    @DisplayName("Should return 400 BAD_REQUEST for HttpMessageNotReadableException (Malformed JSON)")
    void testHandleMalformedJson() {
        HttpMessageNotReadableException ex = new HttpMessageNotReadableException("JSON parse error: Unexpected character");
        ResponseEntity<ApiResponse<String>> response = exceptionHandler.handleMalformedJson(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("Malformed request payload"));
    }

    @Test
    @DisplayName("Should return 400 BAD_REQUEST for MethodArgumentTypeMismatchException")
    void testHandleTypeMismatch() {
        MethodArgumentTypeMismatchException ex = new MethodArgumentTypeMismatchException(
                "invalid_number", Integer.class, "page", null, null);
        ResponseEntity<ApiResponse<String>> response = exceptionHandler.handleTypeMismatch(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("page"));
    }

    @Test
    @DisplayName("Should return 405 METHOD_NOT_ALLOWED for HttpRequestMethodNotSupportedException")
    void testHandleMethodNotAllowed() {
        HttpRequestMethodNotSupportedException ex = new HttpRequestMethodNotSupportedException("DELETE");
        ResponseEntity<ApiResponse<String>> response = exceptionHandler.handleMethodNotAllowed(ex);

        assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("DELETE"));
    }

    @Test
    @DisplayName("Should return 409 CONFLICT for DuplicateKeyException")
    void testHandleDuplicateKey() {
        DuplicateKeyException ex = new DuplicateKeyException("E11000 duplicate key error collection");
        ResponseEntity<ApiResponse<String>> response = exceptionHandler.handleDuplicateKey(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("already exists"));
    }

    @Test
    @DisplayName("Should return 503 SERVICE_UNAVAILABLE for MongoTimeoutException")
    void testHandleDatabaseUnavailable() {
        MongoTimeoutException ex = new MongoTimeoutException("Timed out after 5000 ms");
        ResponseEntity<ApiResponse<String>> response = exceptionHandler.handleDatabaseUnavailable(ex);

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("Database is currently synchronizing"));
    }

    @Test
    @DisplayName("Should return 500 INTERNAL_SERVER_ERROR for unhandled general Exception")
    void testHandleGeneralException() {
        NullPointerException ex = new NullPointerException("Null reference pointer");
        ResponseEntity<ApiResponse<String>> response = exceptionHandler.handleGeneral(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("An unexpected server error occurred"));
    }
}
