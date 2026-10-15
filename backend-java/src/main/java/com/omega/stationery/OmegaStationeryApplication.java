package com.omega.stationery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class OmegaStationeryApplication {

    public static void main(String[] args) {
        SpringApplication.run(OmegaStationeryApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("🚀 OMEGA Stationery Java Spring Boot Backend Started Successfully!");
        System.out.println("📦 Ready for MongoDB Atlas & Render Cloud Deployment");
        System.out.println("📍 API Health Check: /api/health");
        System.out.println("📍 Products API:     /api/products");
        System.out.println("📍 Orders API:       /api/orders");
        System.out.println("==================================================================");
    }
}
