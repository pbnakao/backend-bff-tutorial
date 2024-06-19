package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class AppUser {
    @Id
    @Column(name = "USER_ID", nullable = false)
    private String userId;

    @Column(name = "FIRST_NAME", nullable = true)
    private String firstName;

    @Column(name = "LAST_NAME", nullable = true)
    private String lastName;

    @Column(name = "EMAIL", nullable = true)
    private String email;

    @Column(name = "AGE", nullable = true)
    private int age;

    @Column(name = "COMPANY_CODE", nullable = false)
    private String companyCode;

}
