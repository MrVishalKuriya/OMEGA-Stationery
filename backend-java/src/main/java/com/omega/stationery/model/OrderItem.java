package com.omega.stationery.model;

import java.io.Serializable;

public class OrderItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private String productId;
    private String name;
    private String sku;
    private Integer quantity;
    private Double unitPrice;
    private Double lineTotal;

    public OrderItem() {}

    public OrderItem(String productId, String name, Integer quantity, Double unitPrice, Double lineTotal) {
        this.productId = productId;
        this.name = name;
        this.sku = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
    }

    public OrderItem(String productId, String name, String sku, Integer quantity, Double unitPrice, Double lineTotal) {
        this.productId = productId;
        this.name = name;
        this.sku = sku;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public Double getLineTotal() { return lineTotal; }
    public void setLineTotal(Double lineTotal) { this.lineTotal = lineTotal; }
}
