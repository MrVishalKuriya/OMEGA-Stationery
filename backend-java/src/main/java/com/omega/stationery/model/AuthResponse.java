package com.omega.stationery.model;

import java.io.Serializable;

public class AuthResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private boolean success;
    private String message;
    private String token;
    private UserProfileDto user;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message, String token, UserProfileDto user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public static AuthResponse success(String message, String token, User user) {
        return new AuthResponse(true, message, token, new UserProfileDto(user));
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(false, message, null, null);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserProfileDto getUser() { return user; }
    public void setUser(UserProfileDto user) { this.user = user; }
}
