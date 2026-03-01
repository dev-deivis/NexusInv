package com.david.inventory.service.impl;

import com.david.inventory.dto.request.UserRequest;
import com.david.inventory.dto.response.UserResponse;
import com.david.inventory.entity.User;
import com.david.inventory.entity.enums.UserRole;
import com.david.inventory.repository.UserRepository;
import com.david.inventory.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Si es ADMIN, forzar todos los permisos
        boolean isMaster = request.getRole() == UserRole.ADMIN;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .department(request.getDepartment())
                .canEditProducts(isMaster || request.isCanEditProducts())
                .canDeleteProducts(isMaster || request.isCanDeleteProducts())
                .active(true)
                .build();

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        boolean isMaster = request.getRole() == UserRole.ADMIN;

        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());
        
        // Si es ADMIN, forzar. Si no, tomar lo que venga del formulario
        user.setCanEditProducts(isMaster || request.isCanEditProducts());
        user.setCanDeleteProducts(isMaster || request.isCanDeleteProducts());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long id, String currentUserEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (user.getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Protocolo de Autopreservación: No puede desactivar su propia cuenta.");
        }

        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .department(user.getDepartment() != null ? user.getDepartment() : "N/A")
                .active(user.isActive())
                .canEditProducts(user.isCanEditProducts())
                .canDeleteProducts(user.isCanDeleteProducts())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
