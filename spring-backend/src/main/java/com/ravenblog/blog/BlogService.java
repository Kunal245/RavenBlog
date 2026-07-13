package com.ravenblog.blog;

import com.ravenblog.user.User;
import com.ravenblog.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public IdResponse create(String authorId, BlogRequests.Create request) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not logged in"));
        Post post = new Post();
        post.setTitle(request.title());
        post.setContent(request.content());
        post.setAuthor(author);
        return new IdResponse(postRepository.save(post).getId());
    }

    @Transactional
    public IdResponse update(String authorId, BlogRequests.Update request) {
        Post post = ownedPost(authorId, request.id());
        post.setTitle(request.title());
        post.setContent(request.content());
        return new IdResponse(post.getId());
    }

    @Transactional
    public MessageResponse delete(String authorId, BlogRequests.Delete request) {
        postRepository.delete(ownedPost(authorId, request.id()));
        return new MessageResponse("Blog deleted");
    }

    @Transactional(readOnly = true)
    public BlogsResponse all() {
        return new BlogsResponse(postRepository.findAllWithAuthor().stream().map(this::toBlog).toList());
    }

    @Transactional(readOnly = true)
    public BlogResponse one(String id) {
        Post post = postRepository.findByIdWithAuthor(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found"));
        return toBlog(post);
    }

    private Post ownedPost(String authorId, String postId) {
        Post post = postRepository.findByIdWithAuthor(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found"));
        if (!post.getAuthor().getId().equals(authorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot modify this blog");
        }
        return post;
    }

    private BlogResponse toBlog(Post post) {
        return new BlogResponse(post.getId(), post.getTitle(), post.getContent(), new AuthorResponse(post.getAuthor().getName()));
    }

    public record IdResponse(String id) {
    }

    public record MessageResponse(String msg) {
    }

    public record BlogsResponse(List<BlogResponse> blogs) {
    }

    public record BlogResponse(String id, String title, String content, AuthorResponse author) {
    }

    public record AuthorResponse(String name) {
    }
}
