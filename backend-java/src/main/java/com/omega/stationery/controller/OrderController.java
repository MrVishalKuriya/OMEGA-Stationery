package com.omega.stationery.controller;

import com.omega.stationery.model.ApiResponse;
import com.omega.stationery.model.CustomerOrderInput;
import com.omega.stationery.model.Order;
import com.omega.stationery.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@Valid @RequestBody CustomerOrderInput input) {
        Order saved = orderService.createOrder(input);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order recorded successfully in MongoDB", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{reference}")
    public ResponseEntity<ApiResponse<Order>> getOrderByReference(@PathVariable String reference) {
        Order order = orderService.getOrderByReference(reference);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "CONFIRMED");
        Order updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", updated));
    }
}
