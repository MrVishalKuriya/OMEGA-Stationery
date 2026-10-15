package com.omega.stationery.model;

import java.io.Serializable;

public class UserProfileDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String email;
    private String phone;
    private String accountType;
    private String role;
    private String initials;

    public UserProfileDto() {}

    public UserProfileDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.accountType = user.getAccountType();
        this.role = user.getRole();
        this.initials = user.getInitials();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getInitials() { return initials; }
    public void setInitials(String initials) { this.initials = initials; }
}
