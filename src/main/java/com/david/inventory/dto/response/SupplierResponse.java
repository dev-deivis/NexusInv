package com.david.inventory.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SupplierResponse {
    private Long id;
    private String companyName;
    private String contactName;
    private String email;
    private String phone;
    private String address;
    private String notes;
}
