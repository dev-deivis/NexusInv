package com.david.inventory.service;

import com.david.inventory.dto.request.UserRequest;
import com.david.inventory.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UserRequest request);
    void toggleUserStatus(Long id);
    void deleteUser(Long id);
}
