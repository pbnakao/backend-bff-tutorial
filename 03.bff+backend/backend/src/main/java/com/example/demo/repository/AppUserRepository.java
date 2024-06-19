package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, String> {
    public List<AppUser> findByCompanyCode(String companyCode);
}
