package com.omega.stationery.controller;

import com.omega.stationery.model.ApiResponse;
import com.omega.stationery.repository.OrderRepository;
import com.omega.stationery.repository.ProductRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HealthController {

    private final MongoTemplate mongoTemplate;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final com.omega.stationery.repository.UserRepository userRepository;

    public HealthController(MongoTemplate mongoTemplate,
                            ProductRepository productRepository,
                            OrderRepository orderRepository,
                            com.omega.stationery.repository.UserRepository userRepository) {
        this.mongoTemplate = mongoTemplate;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("service", "OMEGA Stationery Java Backend");
        health.put("runtime", "Java " + System.getProperty("java.version"));
        health.put("uptimeSeconds", ManagementFactory.getRuntimeMXBean().getUptime() / 1000);

        Map<String, Object> database = new HashMap<>();
        boolean mongoConnected = false;
        long productCount = 0;
        long orderCount = 0;
        long usersCount = 0;
        try {
            // Ping MongoDB
            mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
            mongoConnected = true;
            productCount = productRepository.count();
            orderCount = orderRepository.count();
            usersCount = userRepository.count();
        } catch (Exception e) {
            database.put("error", e.getMessage());
        }

        database.put("engine", "MongoDB");
        database.put("connected", mongoConnected);
        database.put("productsCount", productCount);
        database.put("ordersCount", orderCount);
        database.put("usersCount", usersCount);
        database.put("totalDocuments", productCount + orderCount + usersCount);
        database.put("databaseName", mongoTemplate.getDb().getName());

        health.put("database", database);

        return ResponseEntity.ok(ApiResponse.success("OMEGA Java Backend is operating normally", health));
    }
}
