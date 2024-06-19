package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.demo.entity.AppUser;

@RepositoryRestResource(collectionResourceRel = "user", path = "users", exported = true)
public interface AppUserRepository extends JpaRepository<AppUser, String> {
}
