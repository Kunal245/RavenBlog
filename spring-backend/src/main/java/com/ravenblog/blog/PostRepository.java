package com.ravenblog.blog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, String> {

    @Query("select p from Post p join fetch p.author")
    List<Post> findAllWithAuthor();

    @Query("select p from Post p join fetch p.author where p.id = :id")
    Optional<Post> findByIdWithAuthor(String id);
}
