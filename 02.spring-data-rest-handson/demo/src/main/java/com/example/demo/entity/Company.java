package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Company {
    @Id
    @Column(name = "COMPANY_CODE", nullable = false)
    private String companyCode;

    @Column(name = "COMPANY_NAME", nullable = false)
    private String companyName;
}
