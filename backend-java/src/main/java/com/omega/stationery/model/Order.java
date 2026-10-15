package com.omega.stationery.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "orders")
@CompoundIndexes({
    @CompoundIndex(name = "idx_order_phone_created", def = "{'phoneNumber': 1, 'createdAt': -1}"),
    @CompoundIndex(name = "idx_order_status_created", def = "{'status': 1, 'createdAt': -1}"),
    @CompoundIndex(name = "idx_order_created_desc", def = "{'createdAt': -1}")
})
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Indexed(unique = true)
    private String orderReference;

    @Indexed
    private String customerName;

    @Indexed
    private String phoneNumber;

    private String deliveryAddress;

    private Integer selectedWhatsAppIndex;

    private String fulfillmentType; // 'Home Delivery' | 'In-Store Pickup' | 'Upcountry Bus Parcel (Mikoani)'

    private String paymentPreference; // 'Cash on Delivery (COD)' | 'Mobile Money' | 'Bank Transfer' | 'Pay at Store Counter'

    private String orderNotes;

    private List<OrderItem> items = new ArrayList<>();

    private Double subtotal = 0.0;

    private Double deliveryFee = 0.0;

    private Double totalAmount = 0.0;

    @Indexed
    private String status = "PENDING_WHATSAPP"; // PENDING_WHATSAPP, CONFIRMED, PROCESSING, DISPATCHED, DELIVERED, CANCELLED

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Order() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderReference() { return orderReference; }
    public void setOrderReference(String orderReference) { this.orderReference = orderReference; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Integer getSelectedWhatsAppIndex() { return selectedWhatsAppIndex; }
    public void setSelectedWhatsAppIndex(Integer selectedWhatsAppIndex) { this.selectedWhatsAppIndex = selectedWhatsAppIndex; }

    public String getFulfillmentType() { return fulfillmentType; }
    public void setFulfillmentType(String fulfillmentType) { this.fulfillmentType = fulfillmentType; }

    public String getPaymentPreference() { return paymentPreference; }
    public void setPaymentPreference(String paymentPreference) { this.paymentPreference = paymentPreference; }

    public String getOrderNotes() { return orderNotes; }
    public void setOrderNotes(String orderNotes) { this.orderNotes = orderNotes; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(Double deliveryFee) { this.deliveryFee = deliveryFee; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
