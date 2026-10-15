package com.omega.stationery.service;

import com.omega.stationery.exception.ResourceNotFoundException;
import com.omega.stationery.model.*;
import com.omega.stationery.repository.UserRepository;
import com.omega.stationery.util.PasswordUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private User existingUser;

    @BeforeEach
    void setUp() {
        existingUser = new User();
        existingUser.setId("usr-test-123");
        existingUser.setName("Mussa Juma");
        existingUser.setEmail("mussa.juma@omega.co.tz");
        existingUser.setPassword(PasswordUtil.hashPassword("password123"));
        existingUser.setPhone("+255 715 268 391");
        existingUser.setAccountType("wholesale");
        existingUser.setRole("CUSTOMER");
    }

    @Test
    @DisplayName("Should successfully register a new user in MongoDB")
    void testRegisterNewUser() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Neema Mwangi");
        req.setEmail("neema@example.com");
        req.setPassword("securePass123");
        req.setPhone("+255 712 345 678");
        req.setAccountType("individual");

        when(userRepository.findByEmailIgnoreCase("neema@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse res = authService.register(req);

        assertTrue(res.isSuccess());
        assertNotNull(res.getToken());
        assertNotNull(res.getUser());
        assertEquals("neema@example.com", res.getUser().getEmail());
        assertEquals("Neema Mwangi", res.getUser().getName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should reconcile existing user on re-registration instead of failing")
    void testRegisterExistingUserReconciliation() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Mussa Juma Updated");
        req.setEmail("mussa.juma@omega.co.tz");
        req.setPassword("newPass123");

        when(userRepository.findByEmailIgnoreCase("mussa.juma@omega.co.tz")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse res = authService.register(req);

        assertTrue(res.isSuccess());
        assertEquals("Mussa Juma Updated", res.getUser().getName());
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    @DisplayName("Should login existing user with valid credentials")
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest();
        req.setEmail("mussa.juma@omega.co.tz");
        req.setPassword("password123");

        when(userRepository.findByEmailIgnoreCase("mussa.juma@omega.co.tz")).thenReturn(Optional.of(existingUser));

        AuthResponse res = authService.login(req);

        assertTrue(res.isSuccess());
        assertNotNull(res.getToken());
        assertEquals("mussa.juma@omega.co.tz", res.getUser().getEmail());
    }

    @Test
    @DisplayName("Should auto-onboard new user on login if not yet in MongoDB")
    void testLoginAutoOnboardNewUser() {
        LoginRequest req = new LoginRequest();
        req.setEmail("newuser@gmail.com");
        req.setPassword("mypassword");

        when(userRepository.findByEmailIgnoreCase("newuser@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse res = authService.login(req);

        assertTrue(res.isSuccess());
        assertNotNull(res.getToken());
        assertEquals("newuser@gmail.com", res.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException for non-existent user ID")
    void testGetUserByIdNotFound() {
        when(userRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            authService.getUserById("invalid-id");
        });
    }
}
