package com.example.demo.repository;

import java.io.Serializable;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RepositoryRestResource
@NoRepositoryBean
public interface DefaultFalseRepository<T, ID extends Serializable> extends Repository<T, ID> {
    @RestResource(exported = false)
    List<T> findAll();

    @RestResource(exported = false)
    Page<T> findAll(Pageable pageable);

    @RestResource(exported = false)
    List<T> findAll(Sort sort);

    @RestResource(exported = false)
    T findById(ID id);

    @RestResource(exported = false)
    <S extends T> S save(S entity);

    @RestResource(exported = false)
    void deleteById(ID id);
}