package com.ravenblog.blog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @PostMapping
    public BlogService.IdResponse create(@AuthenticationPrincipal String userId, @Valid @RequestBody BlogRequests.Create request) {
        return blogService.create(userId, request);
    }

    @PutMapping
    public BlogService.IdResponse update(@AuthenticationPrincipal String userId, @Valid @RequestBody BlogRequests.Update request) {
        return blogService.update(userId, request);
    }

    @DeleteMapping
    public BlogService.MessageResponse delete(@AuthenticationPrincipal String userId, @Valid @RequestBody BlogRequests.Delete request) {
        return blogService.delete(userId, request);
    }

    @GetMapping("/bulk")
    public BlogService.BlogsResponse all() {
        return blogService.all();
    }

    @GetMapping("/{id}")
    public BlogService.BlogResponse one(@PathVariable String id) {
        return blogService.one(id);
    }
}
