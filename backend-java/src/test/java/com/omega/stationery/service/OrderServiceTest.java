package com.omega.stationery.service;

import com.omega.stationery.exception.ResourceNotFoundException;
import com.omega.stationery.model.CustomerOrderInput;
import com.omega.stationery.model.Order;
import com.omega.stationery.model.OrderItem;
import com.omega.stationery.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService Unit Tests")
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private CustomerOrderInput sampleInput;
    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        sampleInput = new CustomerOrderInput();
        sampleInput.setCustomerName("Juma Rashid");
        sampleInput.setPhoneNumber("+255 715 000 111");
        sampleInput.setDeliveryAddress("Kariakoo, Dar es Salaam");
        sampleInput.setSubtotal(104000.0);
        sampleInput.setDeliveryFee(5000.0);
        sampleInput.setTotalAmount(109000.0);
        sampleInput.setFulfillmentType("Home Delivery");
        sampleInput.setPaymentPreference("M-Pesa");

        OrderItem item = new OrderItem("prod-q2", "Counter Book Q2", 2, 52000.0, 104000.0);
        sampleInput.setItems(List.of(item));

        sampleOrder = new Order();
        sampleOrder.setId("ord-12345");
        sampleOrder.setOrderReference("OMG-ORD-99-5555");
        sampleOrder.setCustomerName("Juma Rashid");
        sampleOrder.setTotalAmount(109000.0);
        sampleOrder.setStatus("PENDING_WHATSAPP");
    }

    @Test
    @DisplayName("Should successfully create order with generated reference and pending status")
    void testCreateOrder() {
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order created = orderService.createOrder(sampleInput);

        assertNotNull(created);
        assertNotNull(created.getOrderReference());
        assertTrue(created.getOrderReference().startsWith("OMG-ORD-"));
        assertEquals("PENDING_WHATSAPP", created.getStatus());
        assertEquals(109000.0, created.getTotalAmount());
        assertEquals("Juma Rashid", created.getCustomerName());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    @DisplayName("Should retrieve order by reference number")
    void testGetOrderByReference() {
        when(orderRepository.findByOrderReference("OMG-ORD-99-5555")).thenReturn(Optional.of(sampleOrder));

        Order found = orderService.getOrderByReference("OMG-ORD-99-5555");

        assertNotNull(found);
        assertEquals("OMG-ORD-99-5555", found.getOrderReference());
        assertEquals("Juma Rashid", found.getCustomerName());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when order does not exist")
    void testGetOrderByReferenceNotFound() {
        when(orderRepository.findByOrderReference("INVALID-REF")).thenReturn(Optional.empty());
        when(orderRepository.findById("INVALID-REF")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            orderService.getOrderByReference("INVALID-REF");
        });
    }

    @Test
    @DisplayName("Should update order status successfully")
    void testUpdateOrderStatus() {
        when(orderRepository.findById("ord-12345")).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order updated = orderService.updateOrderStatus("ord-12345", "DISPATCHED");

        assertNotNull(updated);
        assertEquals("DISPATCHED", updated.getStatus());
    }
}
