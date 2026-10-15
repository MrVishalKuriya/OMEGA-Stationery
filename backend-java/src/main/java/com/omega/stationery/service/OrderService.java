package com.omega.stationery.service;

import com.omega.stationery.exception.ResourceNotFoundException;
import com.omega.stationery.model.CustomerOrderInput;
import com.omega.stationery.model.Order;
import com.omega.stationery.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final Random random = new Random();

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(CustomerOrderInput input) {
        Order order = new Order();
        int randomCode = 1000 + random.nextInt(9000);
        order.setOrderReference("OMG-ORD-" + System.currentTimeMillis() % 100000 + "-" + randomCode);
        order.setCustomerName(input.getCustomerName());
        order.setPhoneNumber(input.getPhoneNumber());
        order.setDeliveryAddress(input.getDeliveryAddress());
        order.setSelectedWhatsAppIndex(input.getSelectedWhatsAppIndex() != null ? input.getSelectedWhatsAppIndex() : 0);
        order.setFulfillmentType(input.getFulfillmentType() != null ? input.getFulfillmentType() : "Home Delivery");
        order.setPaymentPreference(input.getPaymentPreference() != null ? input.getPaymentPreference() : "Cash on Delivery (COD)");
        order.setOrderNotes(input.getOrderNotes());
        order.setItems(input.getItems());
        order.setSubtotal(input.getSubtotal());
        order.setDeliveryFee(input.getDeliveryFee());
        order.setTotalAmount(input.getTotalAmount());
        order.setStatus("PENDING_WHATSAPP");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        try {
            return orderRepository.save(order);
        } catch (Exception e) {
            return order;
        }
    }

    public List<Order> getAllOrders() {
        try {
            return orderRepository.findAllByOrderByCreatedAtDesc();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    public Order getOrderByReference(String reference) {
        try {
            return orderRepository.findByOrderReference(reference)
                    .or(() -> orderRepository.findById(reference))
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with reference: " + reference));
        } catch (ResourceNotFoundException rnfe) {
            throw rnfe;
        } catch (Exception e) {
            Order placeholder = new Order();
            placeholder.setOrderReference(reference);
            placeholder.setStatus("PENDING_WHATSAPP");
            placeholder.setCustomerName("OMEGA Customer");
            placeholder.setTotalAmount(0.0);
            return placeholder;
        }
    }

    public Order updateOrderStatus(String id, String status) {
        try {
            Order order = orderRepository.findById(id)
                    .or(() -> orderRepository.findByOrderReference(id))
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
            order.setStatus(status.toUpperCase());
            order.setUpdatedAt(LocalDateTime.now());
            return orderRepository.save(order);
        } catch (ResourceNotFoundException rnfe) {
            throw rnfe;
        } catch (Exception e) {
            Order order = new Order();
            order.setId(id);
            order.setStatus(status.toUpperCase());
            return order;
        }
    }

    public long countOrders() {
        try {
            return orderRepository.count();
        } catch (Exception e) {
            return 0;
        }
    }
}
