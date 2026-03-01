package com.david.inventory.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String department;
    private boolean active;
    private LocalDateTime createdAt;
}
