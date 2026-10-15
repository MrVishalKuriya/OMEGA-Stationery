package com.omega.stationery.repository;

import com.omega.stationery.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    Optional<Order> findByOrderReference(String orderReference);

    List<Order> findByPhoneNumber(String phoneNumber);

    List<Order> findByPhoneNumberOrderByCreatedAtDesc(String phoneNumber);

    List<Order> findAllByOrderByCreatedAtDesc();

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Order> findByStatus(String status);

    Page<Order> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
}
