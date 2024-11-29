package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class AppUser {
    @Id
    @Column(length = 6, nullable = false)
    private String userId;

    private String firstName;

    private String lastName;

    private String email;

    private int age;

    @Column(name = "COMPANY_CODE", nullable = false)
    private String companyCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPANY_CODE", nullable = false, insertable = false, updatable = false)
    private Company company;
}
