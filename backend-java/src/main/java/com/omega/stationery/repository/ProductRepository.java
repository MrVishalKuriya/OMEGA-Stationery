package com.omega.stationery.repository;

import com.omega.stationery.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    Optional<Product> findBySku(String sku);

    // Indexed Category Queries
    List<Product> findByCategoryIgnoreCase(String category);

    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

    // E-Commerce Merchandising Queries
    List<Product> findByFeaturedTrue();

    Page<Product> findByFeaturedTrue(Pageable pageable);

    List<Product> findByBestSellerTrue();

    Page<Product> findByBestSellerTrue(Pageable pageable);

    // Filter by category and stock availability
    List<Product> findByCategoryIgnoreCaseAndStockStatus(String category, String stockStatus);

    // Filter by category and price range (e.g., TZS 1,000 to TZS 50,000)
    List<Product> findByCategoryIgnoreCaseAndPriceBetween(String category, Double minPrice, Double maxPrice);

    // 1. High-Performance Inverted Text Search Index (O(log N) instead of COLLSCAN)
    @Query(value = "{ $text: { $search: ?0 } }")
    List<Product> searchByTextIndex(String keyword);

    @Query(value = "{ $text: { $search: ?0 } }")
    Page<Product> searchByTextIndex(String keyword, Pageable pageable);

    // 2. High-Performance Prefix/Wildcard Fallback (targeted on indexed name, sku, category)
    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'sku': { $regex: ?0, $options: 'i' } }, " +
           "{ 'category': { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Product> searchByKeyword(String keyword);

    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'sku': { $regex: ?0, $options: 'i' } }, " +
           "{ 'category': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<Product> searchByKeyword(String keyword, Pageable pageable);
}
