package com.omega.stationery.model;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class CustomerOrderInput {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String deliveryAddress;

    private Integer selectedWhatsAppIndex;

    private String fulfillmentType;

    private String paymentPreference;

    private String orderNotes;

    private List<OrderItem> items = new ArrayList<>();

    private Double subtotal = 0.0;

    private Double deliveryFee = 0.0;

    private Double totalAmount = 0.0;

    public CustomerOrderInput() {}

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
}
