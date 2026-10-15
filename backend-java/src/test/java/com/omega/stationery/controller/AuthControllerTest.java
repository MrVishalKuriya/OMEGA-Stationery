package com.omega.stationery.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omega.stationery.exception.GlobalExceptionHandler;
import com.omega.stationery.model.*;
import com.omega.stationery.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Web Layer Tests")
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/auth/register - Should return 201 CREATED for valid registration")
    void testRegisterSuccess() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName("Amina Bakari");
        req.setEmail("amina@example.com");
        req.setPassword("aminaPass123");
        req.setPhone("+255 715 111 222");

        User user = new User();
        user.setId("usr-amina");
        user.setName("Amina Bakari");
        user.setEmail("amina@example.com");

        AuthResponse successResponse = AuthResponse.success("Account created successfully", "mock-token-xyz", user);
        when(authService.register(any(RegisterRequest.class))).thenReturn(successResponse);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", is("mock-token-xyz")))
                .andExpect(jsonPath("$.user.email", is("amina@example.com")));
    }

    @Test
    @DisplayName("POST /api/auth/register - Should return 400 BAD_REQUEST on invalid validation (missing required email)")
    void testRegisterValidationFailure() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName("Amina Bakari");
        // Missing email & password

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Validation failed")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Should return 200 OK for valid credentials")
    void testLoginSuccess() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("mussa.juma@omega.co.tz");
        req.setPassword("password123");

        User user = new User();
        user.setId("usr-mussa");
        user.setName("Mussa Juma");
        user.setEmail("mussa.juma@omega.co.tz");

        AuthResponse successResponse = AuthResponse.success("Welcome back", "jwt-token-abc", user);
        when(authService.login(any(LoginRequest.class))).thenReturn(successResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", is("jwt-token-abc")))
                .andExpect(jsonPath("$.user.name", is("Mussa Juma")));
    }
}
