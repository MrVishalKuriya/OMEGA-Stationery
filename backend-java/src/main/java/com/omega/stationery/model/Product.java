package com.omega.stationery.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.TextIndexed;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "products")
@CompoundIndexes({
    // High-performance E-Commerce Compound Indexes
    @CompoundIndex(name = "idx_cat_price_asc", def = "{'category': 1, 'price': 1}"),
    @CompoundIndex(name = "idx_cat_price_desc", def = "{'category': 1, 'price': -1}"),
    @CompoundIndex(name = "idx_cat_stock", def = "{'category': 1, 'stockStatus': 1}"),
    @CompoundIndex(name = "idx_featured_rating", def = "{'featured': -1, 'rating': -1}"),
    @CompoundIndex(name = "idx_bestseller_rating", def = "{'bestSeller': -1, 'rating': -1}"),
    @CompoundIndex(name = "idx_created_sort", def = "{'createdAt': -1}")
})
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Indexed
    @TextIndexed(weight = 10)
    private String name;

    private String nameSw;

    @Indexed
    @TextIndexed(weight = 6)
    private String category;

    private String image;

    private List<String> gallery = new ArrayList<>();

    @TextIndexed(weight = 2)
    private String description;

    private String descriptionSw;

    private List<Specification> specifications = new ArrayList<>();

    private Double price;

    private Double discountPrice;

    private Double wholesalePrice;

    private Integer wholesaleMinQty;

    private String quire;

    private String pageCount;

    private String size;

    private String paperType;

    private String binding;

    private String stockStatus; // 'In Stock' | 'Low Stock' | 'Out of Stock'

    @Indexed(unique = true)
    @TextIndexed(weight = 8)
    private String sku;

    private Boolean featured = false;

    private Boolean bestSeller = false;

    private Boolean isDemoData = false;

    private Double rating = 5.0;

    private Integer reviewCount = 0;

    @TextIndexed(weight = 4)
    private String subtitle;

    private String badge;

    private List<ColorOption> colorOptions = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Product() {}

    public Product(String id, String name, String category, Double price, String sku, String stockStatus) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.sku = sku;
        this.stockStatus = stockStatus;
    }

    // Nested Specification Class
    public static class Specification implements Serializable {
        private String label;
        private String value;

        public Specification() {}

        public Specification(String label, String value) {
            this.label = label;
            this.value = value;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

    // Nested ColorOption Class
    public static class ColorOption implements Serializable {
        private String name;
        private String hex;

        public ColorOption() {}

        public ColorOption(String name, String hex) {
            this.name = name;
            this.hex = hex;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getHex() { return hex; }
        public void setHex(String hex) { this.hex = hex; }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameSw() { return nameSw; }
    public void setNameSw(String nameSw) { this.nameSw = nameSw; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public List<String> getGallery() { return gallery; }
    public void setGallery(List<String> gallery) { this.gallery = gallery; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDescriptionSw() { return descriptionSw; }
    public void setDescriptionSw(String descriptionSw) { this.descriptionSw = descriptionSw; }

    public List<Specification> getSpecifications() { return specifications; }
    public void setSpecifications(List<Specification> specifications) { this.specifications = specifications; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(Double discountPrice) { this.discountPrice = discountPrice; }

    public Double getWholesalePrice() { return wholesalePrice; }
    public void setWholesalePrice(Double wholesalePrice) { this.wholesalePrice = wholesalePrice; }

    public Integer getWholesaleMinQty() { return wholesaleMinQty; }
    public void setWholesaleMinQty(Integer wholesaleMinQty) { this.wholesaleMinQty = wholesaleMinQty; }

    public String getQuire() { return quire; }
    public void setQuire(String quire) { this.quire = quire; }

    public String getPageCount() { return pageCount; }
    public void setPageCount(String pageCount) { this.pageCount = pageCount; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getPaperType() { return paperType; }
    public void setPaperType(String paperType) { this.paperType = paperType; }

    public String getBinding() { return binding; }
    public void setBinding(String binding) { this.binding = binding; }

    public String getStockStatus() { return stockStatus; }
    public void setStockStatus(String stockStatus) { this.stockStatus = stockStatus; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Boolean getBestSeller() { return bestSeller; }
    public void setBestSeller(Boolean bestSeller) { this.bestSeller = bestSeller; }

    public Boolean getIsDemoData() { return isDemoData; }
    public void setIsDemoData(Boolean isDemoData) { this.isDemoData = isDemoData; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public List<ColorOption> getColorOptions() { return colorOptions; }
    public void setColorOptions(List<ColorOption> colorOptions) { this.colorOptions = colorOptions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
