package com.ravenblog.blog;

import jakarta.validation.constraints.NotNull;

public final class BlogRequests {
    private BlogRequests() {
    }

    public record Create(@NotNull String title, @NotNull String content) {
    }

    public record Update(@NotNull String id, @NotNull String title, @NotNull String content) {
    }

    public record Delete(@NotNull String id) {
    }
}
